# node 运行 npm 脚本

```js
const inquirer = require('inquirer')
const { spawn } = require('child_process')

const arg = process.argv.slice(2)[1]

const choices = [
  { name: '湖南', value: 'hunan' },
  { name: '天津', value: 'tianjin' }
]
arg === 'serve' &&
  choices.unshift({
    name: 'dev环境',
    value: 'dev'
  })

inquirer
  .prompt([
    {
      type: 'list',
      name: 'env',
      message: `选择${arg === 'build' ? '打包' : '开发'}的环境变量：`,
      choices: choices
    }
  ])
  .then(({ env }) => {
    
    let npmScript = `vue-cli-service ${arg}`
    if(env !== 'dev') npmScript += ` --mode ${env}`

    spawn(npmScript, { shell: true, stdio: 'inherit' })
  })
```

- package.json

```js
"scripts": {
  "serve": "node build/selectFramework.js -- serve",
},
```
