# JavaScript ajax 封装

```js
function ajax(setting){
  var ajax = new XMLHttpRequest();
  // 默认 get
  if(!setting.method) setting.method = 'get';

  // 组合data查询数据
  if(setting.data){
    setting.data = getSearch(setting.data);
  }else{
    setting.data = '';
  } 

  if(setting.method.toLowerCase() == 'get'){
    ajax.open('get',setting.url + '?' + setting.data,true);
    ajax.send();
  }else if(setting.method.toLowerCase() == 'post'){
    ajax.open('post',setting.url,true);
    ajax.setRequestHeader('Content-type','appliction/x-www-form-urlencoded');
    ajax.send(setting.data);
  }

  ajax.onreadystatechange = function(){
    if(ajax.readyState == 4){
      if(ajax.status == 200){
        setting.success(ajax.responseText);
      }else{
        console.log('Error:' + ajax.status);
      }
    }
  }
}

// 拼接字符串
function getSearch(obj){
  var str = '';
  for(var key in obj){
    str += key + '=' + obj[key] + '&';
  }
  return str.slice(0,str.length-1);
}
```