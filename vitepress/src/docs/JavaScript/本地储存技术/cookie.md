# JavaScript cookie 

## 存储格式

```js
name=value;[expires=date];[path=path];[domain=somewhere.com];[secure]，
```
键 = 值; 后续中括号的内容，都是可选项。

火狐支持缓存 cookie，谷歌只支持服务器缓存 cookie

- [expires=date]：'expires=过期时间'
- [path=path]：设置的cookie的路径
  - 如果不设置，默认是加载当前.html文件的路径
  - 设置的cookie的路径，和加载当前文件的路径，必须一致，如果不一致，cookie 访问失败。
```js
'username=xxx;path=' + '/code14/cookie'; // 可以访问当前与html同一路径
'username=xxx;path=' + '/code14/cookie/111';// 设置其他路径后 不能访问
```

- [domain=somewhere.com]：domain 限制访问域名
  - 如果不去设置，默认是加载当前 .html 文件的服务器域名 /ip
  - 如果加载当前文件域名和设置的域名不一致，设置 cookie 失败。不能设置
```js
document.cookie = 'username=xxx;domain=' + 'localhostxxx'; // 设置失败
```
- secure 
  - 如果不设置，设置 cookie，可以通过 http/https 协议加载文件设置
  - 设置字段后，只能 https 协议加载 cookie.
```js
document.cookie = 'username=xxx;secure'
```

## 获取cookie
```js
document.cookie
```

## 设置cookie
```js
document.cookie = 'username=xxx';
```

## 转码储存
- encodeURIComponent()：将中文编译成对应的字符
- decodeURIComponent()：将对应的字符编译成中文
```js
document.cookie = 'username=' + encodeURIComponent("蜘蛛侠");
```

## 转码获取
```js
decodeURIComponent(document.cookie)
```

## 删除cookie
```js
document.cookie = "username=;expires=" + new Date(0);
```

## setCookie 封装

```js
function setCookie(name,value,{expires,path,domain,secure}){
  var str = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  if(expires) str += ";expires=" + afterOfDate(expires);
  if(path) str += ";path=" + path;
  if(domain) str += ";domain=" + domain;
  if(secure) str += ";secure";
  document.cookie = str;
}

// 获取n天后的时间
function afterOfDate(n){
  var date = new Date();
  var day = date.getDate();
  date.setDate(n + day);
  return date;
}
```

## getCookie 封装

```js
// n121=sa; 名字=name; 名字2=2name

function getCookie(name){
  var cookieStr = decodeURIComponent(document.cookie);
  var strat = cookieStr.indexOf(" " + name + "=");
  if(strat == "-1"){
​    return null;
  }else{
​    var end = cookieStr.indexOf(";",strat);
​    if(end == "-1"){
​      end = cookieStr.length;
​    }
​    var str = cookieStr.substring(strat,end);
​    return str.split("=")[1];
  }
}

getCookie("名字2")
```

## removeCookie 封装

```js
function removeCookie(name){
  document.cookie = encodeURIComponent(name) + "=;expires=" + new Date(0);
}
```

## cookie 封装

```js
/* 
  $cookie()
  一个参数       获取
  两个参数或以上    设置
  两个参数，参数二 null 删除
 */

function $cookie(){
  switch (arguments.length){
​    case 1 : 
​      return getCookie(arguments[0]);
​    case 2 :
​      if(arguments[1] == null){
​        removeCookie(arguments[0]);
​      }else{
​        setCookie(arguments[0],arguments[1],{});
​      }
​      break;
​    default:
​      setCookie(arguments[0],arguments[1],arguments[3]);
​      break;
  }
}

function setCookie(name,value,{expires,path,domain,secure}){
  var str = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  if(expires) str += ";expires=" + afterOfDate(expires);
  if(path) str += ";path=" + path;
  if(domain) str += ";domain=" + domain;
  if(secure) str += ";secure";
  document.cookie = str;
}

function afterOfDate(n){
  var date = new Date();
  var day = date.getDate();
  date.setDate(n + day);
  return date;
}
function getCookie(name){
  var cookieStr = decodeURIComponent(document.cookie);
  var strat = cookieStr.indexOf(" " + name + "=");
  if(strat == "-1"){
​    return null;
  }else{
​    var end = cookieStr.indexOf(";",strat);
​    if(end == "-1"){
​      end = cookieStr.length;
​    }
​    var str = cookieStr.substring(strat,end);
​    return str.split("=")[1];
  }
}
function removeCookie(name){
  document.cookie = encodeURIComponent(name) + "=;expires=" + new Date(0);
}
```

