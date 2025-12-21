const vscode = require('vscode');
const http = require('http');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('默写单词插件已激活');

    // 注册 Webview 视图提供者
    const provider = new WordDictViewProvider(context.extensionUri, context);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('wordDictView', provider, {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        })
    );

    // 注册刷新命令
    context.subscriptions.push(
        vscode.commands.registerCommand('wordDictView.refresh', () => {
            provider.refresh();
        })
    );
}

function deactivate() {}

class WordDictViewProvider {
    constructor(extensionUri, context) {
        this._extensionUri = extensionUri;
        this._context = context;
        this._oauthServer = null;
        // 判断是否为开发环境
        this._isDevelopment = context.extensionMode === vscode.ExtensionMode.Development;
    }

    resolveWebviewView(webviewView, context, _token) {
        this._webviewView = webviewView;
        
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        // 移除 webview 的默认样式
        webviewView.webview.html = this._getHtmlContent(webviewView.webview);
        
        // 设置 webview 描述（可选）
        webviewView.description = '英语单词默写练习';

        // 监听来自 webview 的消息
        webviewView.webview.onDidReceiveMessage(
            async message => {
                switch (message.type) {
                    case 'vscode-open-external':
                        // 在外部浏览器中打开 URL
                        if (message.url) {
                            vscode.env.openExternal(vscode.Uri.parse(message.url));
                        }
                        break;
                    
                    case 'vscode-oauth-login':
                        // 处理 OAuth 登录请求
                        try {
                            const result = await this._handleOAuthLogin(message.config);
                            webviewView.webview.postMessage({
                                type: 'vscode-oauth-success',
                                data: result
                            });
                        } catch (error) {
                            webviewView.webview.postMessage({
                                type: 'vscode-oauth-error',
                                error: error.message
                            });
                        }
                        break;
                }
            },
            undefined,
            context.subscriptions
        );
    }

    /**
     * 刷新 webview
     */
    refresh() {
        if (this._webviewView) {
            // 重新生成 HTML（带新的时间戳强制刷新 iframe）
            this._webviewView.webview.html = this._getHtmlContent(this._webviewView.webview);
            console.log('Webview 已刷新');
        }
    }

    /**
     * 处理 OAuth 登录流程
     */
    async _handleOAuthLogin(config) {
        const { clientId, clientSecret, redirectPort = 5589 } = config;
        const redirectUri = `http://localhost:${redirectPort}/callback`;

        // 构建 OAuth URL
        const oauthURL = 'https://accounts.google.com/o/oauth2/v2/auth?' +
            new URLSearchParams({
                client_id: clientId,
                redirect_uri: redirectUri,
                response_type: 'code',
                scope: 'email profile',
                access_type: 'offline',
                prompt: 'consent'
            }).toString();

        // 启动本地服务器
        const codePromise = this._startOAuthServer(redirectPort);

        // 在外部浏览器中打开授权页
        await vscode.env.openExternal(vscode.Uri.parse(oauthURL));

        // 等待授权码
        const code = await codePromise;

        // 交换 token
        const tokenData = await this._exchangeCodeForToken(code, {
            clientId,
            clientSecret,
            redirectUri
        });

        return tokenData;
    }

    /**
     * 启动本地 OAuth 回调服务器
     */
    _startOAuthServer(port) {
        return new Promise((resolve, reject) => {
            // 如果已有服务器在运行，先关闭
            if (this._oauthServer) {
                this._oauthServer.close();
            }

            const server = http.createServer((req, res) => {
                if (!req.url) return;

                const url = new URL(req.url, `http://localhost:${port}`);
                if (url.pathname === '/callback') {
                    const code = url.searchParams.get('code');
                    const error = url.searchParams.get('error');

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');

                    if (error) {
                        res.end(`
                            <!DOCTYPE html>
                            <html>
                            <head><meta charset="utf-8"><title>登录失败</title></head>
                            <body>
                                <h2>登录失败</h2>
                                <p>错误: ${error}</p>
                                <p>您可以关闭此窗口</p>
                            </body>
                            </html>
                        `);
                        server.close();
                        reject(new Error(`OAuth error: ${error}`));
                    } else if (code) {
                        res.end(`
                            <!DOCTYPE html>
                            <html>
                            <head><meta charset="utf-8"><title>登录成功</title></head>
                            <body>
                                <h2>登录成功！</h2>
                                <p>您可以关闭此窗口并返回 VSCode</p>
                                <script>window.close();</script>
                            </body>
                            </html>
                        `);
                        server.close();
                        this._oauthServer = null;
                        resolve(code);
                    } else {
                        res.end(`
                            <!DOCTYPE html>
                            <html>
                            <head><meta charset="utf-8"><title>登录失败</title></head>
                            <body>
                                <h2>登录失败</h2>
                                <p>未收到授权码</p>
                                <p>您可以关闭此窗口</p>
                            </body>
                            </html>
                        `);
                        server.close();
                        reject(new Error('No code in callback'));
                    }
                }
            });

            server.on('error', err => {
                this._oauthServer = null;
                reject(err);
            });

            server.listen(port, () => {
                console.log(`OAuth callback server listening on port ${port}`);
            });

            this._oauthServer = server;

            // 5分钟超时
            setTimeout(() => {
                if (server.listening) {
                    server.close();
                    this._oauthServer = null;
                    reject(new Error('OAuth timeout'));
                }
            }, 5 * 60 * 1000);
        });
    }

    /**
     * 用授权码交换 access token
     */
    async _exchangeCodeForToken(code, config) {
        const { clientId, clientSecret, redirectUri } = config;

        const params = new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        });

        const resp = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        if (!resp.ok) {
            const errorText = await resp.text();
            throw new Error(`Token exchange failed: ${resp.status} - ${errorText}`);
        }

        return resp.json();
    }

    _getHtmlContent(webview) {
        // 添加时间戳参数强制 iframe 刷新
        const timestamp = Date.now();
        
        // 根据环境选择 URL
        const baseUrl = this._isDevelopment 
            ? 'http://localhost:5173/docs/%E5%9C%A8%E7%BA%BF%E5%BA%94%E7%94%A8/%E5%B7%A5%E5%85%B7/%E5%9C%A8%E7%BA%BF%E9%BB%98%E5%86%99%E5%8D%95%E8%AF%8D.html'
            : 'https://kuangyx.cn/docs/%E5%9C%A8%E7%BA%BF%E5%BA%94%E7%94%A8/%E5%B7%A5%E5%85%B7/%E5%9C%A8%E7%BA%BF%E9%BB%98%E5%86%99%E5%8D%95%E8%AF%8D.html';
        
        const iframeSrc = `${baseUrl}?vscode=true&_t=${timestamp}`;
        
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>默写单词</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            /* 移除 VSCode webview 默认的内边距 */
            margin: 0 !important;
            padding: 0 !important;
        }
        body {
            /* 确保 body 完全填充 */
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        iframe {
            border: none;
            width: 100%;
            height: 100%;
            display: block; /* 移除 inline 元素的默认间距 */
            /* 确保 iframe 完全填充 */
            position: absolute;
            top: 0;
            left: 0;
        }
    </style>
</head>
<body>
  <iframe 
    id="app-iframe"
    src="${iframeSrc}" 
    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-storage-access-by-user-activation"
    width="100%" 
    height="100%"></iframe>
  <script>
    const vscode = acquireVsCodeApi();
    const iframe = document.getElementById('app-iframe');
    
    // 监听来自 iframe 的消息
    window.addEventListener('message', (event) => {
      const message = event.data;
      
      // 转发消息到 VSCode 扩展
      if (message.type === 'vscode-open-external' || message.type === 'vscode-oauth-login') {
        vscode.postMessage(message);
      }
    });

    // 监听来自 VSCode 扩展的消息
    window.addEventListener('message', (event) => {
      const message = event.data;
      
      // 转发 OAuth 结果到 iframe
      if (message.type === 'vscode-oauth-success' || message.type === 'vscode-oauth-error') {
        iframe.contentWindow.postMessage(message, '*');
      }
    });
  </script>
</body>
</html>`;
  }
}
{/* <iframe 
    src="https://kuangyx.cn/docs/%E5%9C%A8%E7%BA%BF%E5%BA%94%E7%94%A8/%E5%B7%A5%E5%85%B7/%E5%9C%A8%E7%BA%BF%E9%BB%98%E5%86%99%E5%8D%95%E8%AF%8D.html?vscode=true" 
    sandbox=""
    width="100%" 
    height="100%"></iframe> */}

module.exports = {
    activate,
    deactivate
};

