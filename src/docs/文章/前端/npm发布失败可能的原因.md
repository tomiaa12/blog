# npm publish 403 发布失败可能的原因

1、npm 权限的原因，解决方案：`npm publish --access=public`。

2、npm 源地址不对，解决方案：

- `npm i -g nrm`

- `nrm use npm` 切换为 npm 官方的地址再尝试。

3、package 的 name 属性与项目文件夹名称一致时可能会导致发布失败，解决方案：更改文件夹名称。

4、npm 版本过低，解决方案：`npm i -g npm update`。

5、npmjs.org 官网可能存在同名的包，之前存在同名的包被删除后，24 小时之内不能重新发布。解决方案：打开链接`https://registry.npmjs.org/你的包名`查看返回的数据：

- 如果 npm 存在这个包名或者这个包名被 npm 官方占用会返回一大串 json 数据，更改包名即可。

- 如果不存在这个包名会返回：`{"error":"Not found"}`表示可以发布这个包名。

- 包名存在时错误信息：

```
  npm ERR! code E403
  npm ERR! 403 403 Forbidden - PUT https://registry.npmjs.org/xxx - You do not have permission to publish "xxx". Are you logged in as the correct user?
  npm ERR! 403 In most cases, you or one of your dependencies are requesting
  npm ERR! 403 a package version that is forbidden by your security policy.
```

6、npm 账号注册后需要验证邮箱，没有验证会导致发布失败，解决方案：`npmjs.org`登录账号点击右上角头像 - 再点击 Profile 验证邮箱。错误信息：

```sh
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT https://registry.npmjs.org/xxx-xxx-npm - Forbidden
npm ERR! 403 In most cases, you or one of your dependencies are requesting
npm ERR! 403 a package version that is forbidden by your security policy.
```

7、`version`版本不对，在已发布的包中直接发布相同的版本号会报错，解决方案：修改`package`的`version`。

```sh
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT https://registry.npmjs.org/xxx - You cannot publish over the previously published versions: 1.0.0.
npm ERR! 403 In most cases, you or one of your dependencies are requesting
npm ERR! 403 a package version that is forbidden by your security policy.
```

8、发布带“@”开头的包时如果报 402 会提示没有权限，npm 认为你会发布私有包，私有包是需要购买的。

在`packages.json`设置`"private": false`，且发布时使用命令`npm publish --access public`表明是发布公有包。

注意：`packages.json`中`"name": "@用户名/包名"`用户名不能随便填，只能填当前登录的用户名。使用`npm whoami`查看当前登录的用户名。
