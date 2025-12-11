const vscode = require('vscode');

/**
 * 窗口管理器类
 */
class PanelManager {
    constructor() {
        this._panels = new Map(); // panelId -> NesGamesPanel
        this._nextId = 1;
        this._onPanelDisposedCallbacks = [];
    }

    createNewPanel(extensionUri, gameUrl = null) {
        const panelId = `panel_${this._nextId++}`;
        const name = `游戏窗口 ${this._nextId - 1} (Game Window ${this._nextId - 1})`;
        
        const panel = new NesGamesPanel(panelId, name, extensionUri, gameUrl, () => {
            this._panels.delete(panelId);
            this._onPanelDisposedCallbacks.forEach(cb => cb());
        });
        
        this._panels.set(panelId, panel);
        return panel;
    }

    getPanel(panelId) {
        return this._panels.get(panelId);
    }

    showPanel(panelId) {
        const panel = this._panels.get(panelId);
        if (panel) {
            panel.show();
        }
    }

    renamePanel(panelId, newName) {
        const panel = this._panels.get(panelId);
        if (panel) {
            panel.rename(newName);
        }
    }

    closePanel(panelId) {
        const panel = this._panels.get(panelId);
        if (panel) {
            panel.dispose();
        }
    }

    getAllPanels() {
        return Array.from(this._panels.values());
    }

    onPanelDisposed(callback) {
        this._onPanelDisposedCallbacks.push(callback);
    }

    disposeAll() {
        this._panels.forEach(panel => panel.dispose());
        this._panels.clear();
    }
}

// 窗口管理器
const panelManager = new PanelManager();

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('小霸王插件已激活');

    // 注册树视图提供者（侧边栏）
    const treeDataProvider = new NesGamesTreeProvider(panelManager);
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('nesGamesView', treeDataProvider)
    );

    // 注册打开新窗口命令
    context.subscriptions.push(
        vscode.commands.registerCommand('nesGames.openNewPanel', () => {
            panelManager.createNewPanel(context.extensionUri);
            treeDataProvider.refresh();
        })
    );

    // 注册切换到窗口命令
    context.subscriptions.push(
        vscode.commands.registerCommand('nesGames.showPanel', (panelId) => {
            panelManager.showPanel(panelId);
        })
    );

    // 注册重命名窗口命令
    context.subscriptions.push(
        vscode.commands.registerCommand('nesGames.renamePanel', async (treeItem) => {
            // 从 TreeItem 中获取 panelId
            const panelId = treeItem.panelId;
            const panel = panelManager.getPanel(panelId);
            if (!panel) return;

            const newName = await vscode.window.showInputBox({
                prompt: '请输入新的窗口名称(Enter new window name)',
                value: panel.name,
                placeHolder: '窗口名称(Window name)'
            });

            if (newName && newName.trim()) {
                panelManager.renamePanel(panelId, newName.trim());
                treeDataProvider.refresh();
            }
        })
    );

    // 注册关闭窗口命令
    context.subscriptions.push(
        vscode.commands.registerCommand('nesGames.closePanel', (treeItem) => {
            // 从 TreeItem 中获取 panelId
            const panelId = treeItem.panelId;
            panelManager.closePanel(panelId);
            treeDataProvider.refresh();
        })
    );

    // 监听面板关闭事件，更新树视图
    panelManager.onPanelDisposed(() => {
        treeDataProvider.refresh();
    });
}

function deactivate() {
    panelManager.disposeAll();
}

/**
 * 树视图数据提供者（侧边栏显示）
 */
class NesGamesTreeProvider {
    constructor(panelManager) {
        this._panelManager = panelManager;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            const items = [];
            
            // 添加提示信息（分多行显示）
            items.push(new InfoTreeItem('⚠️ 数据资源托管在 GitHub', 'Resources hosted on GitHub'));
            items.push(new InfoTreeItem('⚠️ 请检查代理情况，否则可能无法打开页面', 'Please check your proxy settings'));
            
            // 添加"打开新游戏窗口"按钮
            items.push(
                new NesGameItem(
                    '打开新游戏窗口(Open New Game Window)',
                    '点击打开一个新的游戏窗口(Click to open a new game window)',
                    'nesGames.openNewPanel',
                    'add'
                )
            );

            // 添加已打开的窗口列表
            const panels = this._panelManager.getAllPanels();
            panels.forEach(panel => {
                items.push(
                    new PanelTreeItem(panel.id, panel.name)
                );
            });

            return items;
        }
        return [];
    }
}

/**
 * 树视图项 - 信息提示
 */
class InfoTreeItem extends vscode.TreeItem {
    constructor(label, tooltip) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = tooltip;
        this.iconPath = new vscode.ThemeIcon('info', new vscode.ThemeColor('notificationsInfoIcon.foreground'));
        this.contextValue = 'info';
    }
}

/**
 * 树视图项 - 打开新窗口按钮
 */
class NesGameItem extends vscode.TreeItem {
    constructor(label, tooltip, command, icon = 'game') {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = tooltip;
        this.command = {
            command: command,
            title: label
        };
        this.iconPath = new vscode.ThemeIcon(icon);
    }
}

/**
 * 树视图项 - 已打开的窗口
 */
class PanelTreeItem extends vscode.TreeItem {
    constructor(panelId, name) {
        super(name, vscode.TreeItemCollapsibleState.None);
        this.panelId = panelId;
        this.tooltip = `点击显示窗口(Click to show): ${name}`;
        this.iconPath = new vscode.ThemeIcon('window');
        this.contextValue = 'gamePanel';
        
        // 点击切换到对应窗口
        this.command = {
            command: 'nesGames.showPanel',
            title: '显示面板(Show Panel)',
            arguments: [panelId]
        };
    }
}

/**
 * WebView 面板（独立窗口）
 */
class NesGamesPanel {
    static viewType = 'nesGamesPanel';

    constructor(id, name, extensionUri, gameUrl, onDispose) {
        this.id = id;
        this.name = name;
        this._extensionUri = extensionUri;
        this._gameUrl = gameUrl;
        this._onDispose = onDispose;
        this._disposables = [];

        const column = vscode.ViewColumn.One;

        // 创建新面板
        this._panel = vscode.window.createWebviewPanel(
            NesGamesPanel.viewType,
            name,
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        // 设置 webview 的初始 HTML 内容
        this._update();

        // 监听面板关闭事件
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // 监听来自 webview 的消息
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.type) {
                    case 'alert':
                        vscode.window.showInformationMessage(message.text);
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    show() {
        this._panel.reveal(vscode.ViewColumn.One);
    }

    rename(newName) {
        this.name = newName;
        this._panel.title = newName;
    }

    dispose() {
        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }

        // 调用回调通知管理器
        if (this._onDispose) {
            this._onDispose();
        }
    }

    _update() {
        const webview = this._panel.webview;
        this._panel.title = this.name;
        this._panel.webview.html = this._getHtmlContent(webview);
    }

    _getHtmlContent(webview) {
        const gameUrl = this._gameUrl || 'http://localhost:5173/pages/game.html';
        
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>小霸王</title>
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
        }
        body {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
        }
        iframe {
            border: none;
            width: 100%;
            height: 100%;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
        }
    </style>
</head>
<body>
    <iframe 
        id="game-iframe"
        src="${gameUrl}?vscode=true" 
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
        width="100%" 
        height="100%">
    </iframe>
    <script>
        const vscode = acquireVsCodeApi();
        const iframe = document.getElementById('game-iframe');
        
        // 监听来自 iframe 的消息
        window.addEventListener('message', (event) => {
            const message = event.data;
            
            // 可以在这里处理来自游戏页面的消息
            if (message.type) {
                vscode.postMessage(message);
            }
        });
    </script>
</body>
</html>`;
    }
}

module.exports = {
    activate,
    deactivate
};

