const vscode = require('vscode');
const { execSync } = require('child_process');

const PROVIDER_DEFAULTS = {
    deepseek: {
        model: 'deepseek-chat',
        apiUrl: 'https://api.deepseek.com/v1/chat/completions'
    },
    openai: {
        model: 'gpt-4o-mini',
        apiUrl: 'https://api.openai.com/v1/chat/completions'
    },
    qwen: {
        model: 'qwen-turbo',
        apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
    },
    custom: {
        model: '',
        apiUrl: ''
    }
};

/**
 * 获取当前模型配置
 */
function getModelConfig() {
    const config = vscode.workspace.getConfiguration('commitAiPro');
    let provider = config.get('provider', 'deepseek');
    if (!Object.prototype.hasOwnProperty.call(PROVIDER_DEFAULTS, provider)) {
        provider = 'deepseek';
    }

    const defaultConfig = PROVIDER_DEFAULTS[provider];
    const apiKey = config.get(`${provider}ApiKey`, '').trim();
    const model = config.get(`${provider}Model`, defaultConfig.model).trim();
    const apiUrl = config.get(`${provider}ApiUrl`, defaultConfig.apiUrl).trim();

    if (!apiKey) {
        return null;
    }

    if (!model) {
        throw new Error(`未配置 ${provider} 模型名，请在设置中填写 commitAiPro.${provider}Model`);
    }

    if (!apiUrl) {
        throw new Error(`未配置 ${provider} 接口地址，请在设置中填写 commitAiPro.${provider}ApiUrl`);
    }

    return {
        provider,
        model,
        apiKey,
        apiUrl
    };
}

/**
 * 获取用户配置的 Commit Types
 */
function getCommitTypes() {
    const config = vscode.workspace.getConfiguration('commitAiPro');
    const types = config.get('commitTypes');
    
    if (!types || !Array.isArray(types) || types.length === 0) {
        // 默认类型
        return [
            { type: 'feat', description: '新功能' },
            { type: 'fix', description: '修复' },
            { type: 'docs', description: '文档' },
            { type: 'style', description: '格式调整' },
            { type: 'refactor', description: '重构' },
            { type: 'perf', description: '性能优化' },
            { type: 'test', description: '测试' },
            { type: 'build', description: '构建' },
            { type: 'ci', description: '配置' },
            { type: 'chore', description: '杂项' },
            { type: 'revert', description: '回退' }
        ];
    }
    
    return types;
}

/**
 * 检查是否启用 Issue ID
 */
function isIncludeIssueId() {
    const config = vscode.workspace.getConfiguration('commitAiPro');
    return config.get('includeIssueId', true);
}

/**
 * 生成后是否展示 Token 费用
 */
function shouldShowTokenCost() {
    const config = vscode.workspace.getConfiguration('commitAiPro');
    return config.get('showTokenCost', true);
}

/**
 * 从分支名提取 Issue ID
 * 支持格式：feature/123-xxx, bugfix/456, 123-feature, issue-789 等
 */
function extractIssueIdFromBranch(repoPath) {
    try {
        const branchName = execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: repoPath,
            encoding: 'utf-8'
        }).trim();
        
        console.log('当前分支:', branchName);
        
        // 匹配各种格式的数字ID
        // 1. feature/123-xxx 或 feature/123
        // 2. 123-xxx
        // 3. issue-123 或 #123
        const patterns = [
            /\/(\d+)[-_]/,      // feature/123-xxx
            /\/(\d+)$/,         // feature/123
            /^(\d+)[-_]/,       // 123-xxx
            /[-_](\d+)[-_]/,    // xxx-123-xxx
            /[-_](\d+)$/,       // xxx-123
            /#(\d+)/,           // #123
        ];
        
        for (const pattern of patterns) {
            const match = branchName.match(pattern);
            if (match) {
                const issueId = match[1];
                console.log('提取到 Issue ID:', issueId);
                return issueId;
            }
        }
        
        console.log('分支名中未找到 Issue ID');
        return null;
        
    } catch (error) {
        console.error('获取分支名失败:', error);
        return null;
    }
}

// 需要排除的文件扩展名（压缩文件、二进制文件等）
const EXCLUDED_EXTENSIONS = [
    '.min.js', '.min.css', '.bundle.js', '.chunk.js',
    '.map', '.lock', '.log',
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.eot',
    '.zip', '.tar', '.gz', '.rar', '.7z',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    '.exe', '.dll', '.so', '.dylib'
];

/**
 * 检查是否为压缩/minified 文件
 */
function isMinifiedContent(content) {
    const lines = content.split('\n');
    
    // 如果文件只有很少行（<= 5行）但每行很长（> 500 字符），可能是压缩文件
    if (lines.length <= 5) {
        const hasLongLine = lines.some(line => line.length > 500);
        if (hasLongLine) {
            return true;
        }
    }
    
    // 检查平均行长度
    const totalLength = content.length;
    const avgLineLength = totalLength / Math.max(lines.length, 1);
    
    // 如果平均行长度超过 200 字符，可能是压缩文件
    if (avgLineLength > 200) {
        return true;
    }
    
    return false;
}

/**
 * 获取 git diff 并过滤压缩文件
 */
function getFilteredGitDiff(repoPath) {
    try {
        // 获取暂存区的 diff
        let diff = execSync('git diff --cached', {
            cwd: repoPath,
            encoding: 'utf-8',
            maxBuffer: 10 * 1024 * 1024 // 10MB
        });

        // 如果暂存区为空，获取工作区的 diff
        if (!diff.trim()) {
            diff = execSync('git diff', {
                cwd: repoPath,
                encoding: 'utf-8',
                maxBuffer: 10 * 1024 * 1024
            });
        }

        if (!diff.trim()) {
            return null;
        }

        // 按文件分割 diff
        const files = diff.split(/^diff --git /m).filter(Boolean);
        const filteredFiles = [];

        for (const fileDiff of files) {
            const lines = fileDiff.split('\n');
            const firstLine = lines[0] || '';
            
            // 提取文件名
            const match = firstLine.match(/a\/(.*?) b\/(.*?)$/);
            if (!match) continue;
            
            const fileName = match[2];
            
            // 检查是否为排除的扩展名
            const isExcluded = EXCLUDED_EXTENSIONS.some(ext => fileName.endsWith(ext));
            if (isExcluded) {
                console.log(`排除文件（扩展名）: ${fileName}`);
                continue;
            }
            
            // 检查文件内容是否为压缩/minified
            const content = lines.slice(1).join('\n');
            if (isMinifiedContent(content)) {
                console.log(`排除文件（压缩内容）: ${fileName}`);
                continue;
            }
            
            filteredFiles.push('diff --git ' + fileDiff);
        }

        const filteredDiff = filteredFiles.join('\n');
        
        // 限制 diff 大小（最多 4000 行）
        const diffLines = filteredDiff.split('\n');
        if (diffLines.length > 4000) {
            return diffLines.slice(0, 4000).join('\n') + '\n\n[... diff 内容过长，已截断 ...]';
        }
        
        return filteredDiff;
        
    } catch (error) {
        console.error('获取 git diff 失败:', error);
        throw new Error(`获取 git diff 失败: ${error.message}`);
    }
}

/**
 * 调用大模型 API 生成 commit message
 */
async function generateCommitMessage(diff, modelConfig, commitTypes, issueId) {
    // 构建 type 列表说明
    const typesList = commitTypes
        .map(t => `${t.type}(${t.description})`)
        .join('、');
    
    // 构建示例（包含 Issue ID）
    let examples = commitTypes.slice(0, 4).map(t => {
        if (issueId) {
            return `- ${t.type}: #${issueId} ${getExampleDescription(t.type)}`;
        } else {
            return `- ${t.type}: ${getExampleDescription(t.type)}`;
        }
    }).join('\n');
    
    // 构建格式要求
    let formatRequirement = issueId 
        ? `2. 格式：<type>: #${issueId} <subject>`
        : `2. 格式：<type>: <subject>`;
    
    const response = await fetch(modelConfig.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${modelConfig.apiKey}`
        },
        body: JSON.stringify({
            model: modelConfig.model,
            messages: [
                {
                    role: 'system',
                    content: `你是一个专业的 git commit message 生成助手。
请根据代码变更生成简洁、规范的 commit message。

格式要求：
1. 使用中文描述
${formatRequirement}
3. type 类型：${typesList}
4. subject 简洁明了，不超过50个字符
5. 只返回 commit message，不要有其他解释

示例：
${examples}`
                },
                {
                    role: 'user',
                    content: `请为以下代码变更生成 commit message：\n\n${diff}`
                }
            ],
            temperature: 0.3,
            max_tokens: 100
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${modelConfig.provider} API 调用失败 (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const message = data.choices[0].message.content.trim();
    
    // 记录 token 使用情况
    const usage = data.usage;
    console.log('Token 使用情况:', usage);
    if (modelConfig.provider === 'deepseek') {
        console.log('预估费用:', {
            input: `¥${(usage.prompt_tokens / 1000000 * 0.07).toFixed(6)}`,
            output: `¥${(usage.completion_tokens / 1000000 * 0.28).toFixed(6)}`,
            total: `¥${(usage.prompt_tokens / 1000000 * 0.07 + usage.completion_tokens / 1000000 * 0.28).toFixed(6)}`
        });
    }
    
    return {
        message,
        usage
    };
}

/**
 * 根据 type 返回示例描述
 */
function getExampleDescription(type) {
    const examples = {
        'feat': '添加用户登录功能',
        'fix': '修复列表页面数据显示错误',
        'docs': '更新 API 文档',
        'style': '调整代码格式',
        'refactor': '重构数据处理逻辑',
        'test': '添加单元测试',
        'chore': '更新构建配置',
        'perf': '优化查询性能',
        'ci': '更新 CI 配置',
        'build': '更新依赖版本'
    };
    
    return examples[type] || '更新功能';
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Commit Message Generator 插件已激活');

    // 注册生成 commit message 命令
    const disposable = vscode.commands.registerCommand('commitAiPro.generate', async () => {
        try {
            // 获取 Git 扩展
            const gitExtension = vscode.extensions.getExtension('vscode.git');
            if (!gitExtension) {
                vscode.window.showErrorMessage('Git 扩展未安装');
                return;
            }

            const git = gitExtension.exports.getAPI(1);
            
            // 获取当前工作区的 Git 仓库
            if (git.repositories.length === 0) {
                vscode.window.showWarningMessage('当前工作区不是 Git 仓库');
                return;
            }

            const repository = git.repositories[0];
            const repoPath = repository.rootUri.fsPath;

            // 检查模型配置
            const modelConfig = getModelConfig();
            if (!modelConfig) {
                const action = await vscode.window.showErrorMessage(
                    '未配置当前模型 API Key',
                    '去配置'
                );
                
                if (action === '去配置') {
                    const settingsQuery = `@ext:${context.extension.id} commitAiPro.`;
                    vscode.commands.executeCommand('workbench.action.openSettings', settingsQuery);
                }
                return;
            }

            // 获取配置
            const commitTypes = getCommitTypes();
            const includeIssueId = isIncludeIssueId();
            const showTokenCost = shouldShowTokenCost();
            
            // 提取 Issue ID（如果启用）
            let issueId = null;
            if (includeIssueId) {
                issueId = extractIssueIdFromBranch(repoPath);
            }

            // 显示进度提示
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "正在生成 Commit Message...",
                cancellable: false
            }, async (progress) => {
                try {
                    // 1. 获取并过滤 git diff
                    progress.report({ message: "获取代码变更..." });
                    const diff = getFilteredGitDiff(repoPath);

                    if (!diff || !diff.trim()) {
                        vscode.window.showWarningMessage('没有检测到代码变更');
                        return;
                    }

                    // 2. 调用模型生成 commit message
                    progress.report({ message: `AI 生成中（${modelConfig.provider}/${modelConfig.model}）...` });
                    const result = await generateCommitMessage(diff, modelConfig, commitTypes, issueId);

                    // 3. 填充到 git commit 输入框
                    repository.inputBox.value = result.message;

                    // 4. 显示成功提示
                    const usage = result.usage;
                    const cost = modelConfig.provider === 'deepseek'
                        ? (usage.prompt_tokens / 1000000 * 0.07 + usage.completion_tokens / 1000000 * 0.28).toFixed(6)
                        : null;

                    let successMessage = '✨ Commit Message 已生成！';
                    if (showTokenCost && cost !== null) {
                        successMessage += `\nToken: ${usage.total_tokens} | 费用: ¥${cost}`;
                    }
                    vscode.window.showInformationMessage(successMessage);

                    // 5. 在输出面板显示详细信息
                    const outputChannel = vscode.window.createOutputChannel('Commit Msg Generator');
                    outputChannel.clear();
                    outputChannel.appendLine('========================================');
                    outputChannel.appendLine('Commit Message Generator');
                    outputChannel.appendLine(`时间: ${new Date().toLocaleString()}`);
                    outputChannel.appendLine(`模型: ${modelConfig.provider}/${modelConfig.model}`);
                    outputChannel.appendLine('========================================');
                    outputChannel.appendLine('');
                    if (issueId) {
                        outputChannel.appendLine(`分支 Issue ID: #${issueId}`);
                        outputChannel.appendLine('');
                    }
                    outputChannel.appendLine('生成的 Message:');
                    outputChannel.appendLine(result.message);
                    outputChannel.appendLine('');
                    outputChannel.appendLine('Token 使用情况:');
                    outputChannel.appendLine(`  输入: ${usage.prompt_tokens} tokens`);
                    outputChannel.appendLine(`  输出: ${usage.completion_tokens} tokens`);
                    outputChannel.appendLine(`  总计: ${usage.total_tokens} tokens`);
                    outputChannel.appendLine('');
                    if (showTokenCost && modelConfig.provider === 'deepseek') {
                        outputChannel.appendLine('费用统计:');
                        outputChannel.appendLine(`  输入费用: ¥${(usage.prompt_tokens / 1000000 * 0.07).toFixed(6)}`);
                        outputChannel.appendLine(`  输出费用: ¥${(usage.completion_tokens / 1000000 * 0.28).toFixed(6)}`);
                        outputChannel.appendLine(`  总费用: ¥${cost}`);
                        outputChannel.appendLine('========================================');
                    }

                } catch (error) {
                    vscode.window.showErrorMessage(`生成失败: ${error.message}`);
                    console.error('生成 Commit Message 失败:', error);
                }
            });

        } catch (error) {
            vscode.window.showErrorMessage(`发生错误: ${error.message}`);
            console.error('Commit Message Generator Error:', error);
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {
    console.log('Commit Message Generator 插件已停用');
}

module.exports = {
    activate,
    deactivate
};
