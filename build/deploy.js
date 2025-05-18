import { createPromptModule } from "inquirer";
import { spawn } from "child_process";

const folder = 'kuangyx'

const arg = process.argv.slice(2)[1];
const prompt = createPromptModule()

const choices = [
  {
    name: "生产服务器",
    user: 'root',
    ip: "113.45.249.208",
    dir: "/www/wwwroot/kuangyx",
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
    const npmScript = `scp -r ${folder} ${user}@${ip}:${dir}`;
    const child = spawn(npmScript, { shell: true, stdio: 'inherit' })
    child.on('close', () => console.log(`--- ${name}上传完成 ---`));
  });
