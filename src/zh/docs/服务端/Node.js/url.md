# Node.js url

## URL 对象

返回与传统 parse 一样的对象

```js
const u = new URL('https://www.baidu.com:8080?abc=ca&cb=qw#aa');
```

判断某个字符串是否是以指定的字符开头：startsWith() 字符串. startsWith(‘/ad’)

```js
url.parse('https://www.baidu.com:8080/api.php?from=qian&soucces=123#lenst1',true)
```

返回一个对象，其中 query 键为 ? 后面查询的字符串

```js
// 参数1 地址
// 参数2 是否对?后面的解析成对象,false不解析,就是字符串
// 参数3 在地址不知道http协议下,传入true(protocol\slashes\auth\host\port\hostname)可以解析,不传都是null

Url {
  protocol: 'https:',
  slashes: true,
  auth: null,
  host: 'www.baidu.com:8080',
  port: '8080',
  hostname: 'www.baidu.com',
  hash: '#lenst1',
  search: '?from=qian&soucces=123',
  query: 'from=qian&soucces=123',
  pathname: '/api.php',
  path: '/api.php?from=qian&soucces=123',
  href: 'https://www.baidu.com:8080/api.php?from=qian&soucces=123#lenst1'
}

// 将url对象解析成地址
url.format({protocol: 'https:',slashes: true,auth:...等});
// https://www.baidu.com:8080/api.php?from=qian&soucces=123#lenst1

// 将两端url解析成一个完整的url
url.resolve('http:// www.baidu.com','/api/list.php');
// http:// www.baidu.com/api/list.php
```

## querystring

```js
querystring.stringify(obj[, sep[, eq[, options]]]) // 将对象转换成字符串
// obj 对象 
// sep 键值对与键值对 之间的连接符号 默认'&'
// eq 键与值之间连接符号 默认'='

querystring.parse(str[, sep[, eq[, options]]]) // 将字符串转换成对象
  // 与字符串同理

querystring.escape(str) // 将字符串转换成字符编码
querystring.unescape(str)// 将字符编码转换成字符串
```