# npm 命令一键部署至服务器

- npm 脚本增加以下命令

```json
"scripts": {
  "dep": "scp -r [本地文件夹] [服务器用户名]@[服务器IP]:[服务器目标目录]"
}
```

- 例如

```sh
scp -r dist centos@192.168.10.1:/usr/nginx/
```

运行`npm run dep`后，会提示输入密码，以上代码会将当前 dist 文件夹所以文件传输到/usr/nginx/dist 下

## 重命名文件夹后上传至服务器

```json
"scripts": {
  "dep": "ren [旧文件夹名] [新文件夹名] && scp -r [新文件夹名] [服务器用户名]@[服务器IP]:[服务器目标目录]"
}
```

## 服务器无权限修改的问题

```sh
scp: remote setstat "/usr/xxx": Permission denied
```

在服务器上运行一下命令

1. 进入部署目录：`cd /usr/xxx`
2. 修改当前用户文件夹权限：`chown -R [用户名] [文件夹]`


## 完整示例

```js
const inquirer = require("inquirer");
const { spawn } = require("child_process");

const arg = process.argv.slice(2)[1];
const prompt = inquirer.createPromptModule()

const choices = [
  {
    name: "开发环境 xx.88",
    user: 'centos',
    ip: "192.168.xx.xx",
    dir: "/centos/deploy/web",
  },
  {
    name: "测试环境 xx.xx",
    user: 'centos',
    ip: "192.168.xx.79",
    dir: "/data/web",
  },
];

prompt([
    {
      type: "list",
      name: "env",
      message: `选择上传到的服务器：`,
      choices: choices,
    },
  ])
  .then(({ env }) => {
    const { user, ip, dir, name } = choices.find((i) => i.name === env);
    const npmScript = `scp -r dist ${user}@${ip}:${dir}`;
    const child = spawn(npmScript, { shell: true, stdio: 'inherit' })
    child.on('close', () => console.log(`--- ${name}上传完成 ---`));
  });
```


