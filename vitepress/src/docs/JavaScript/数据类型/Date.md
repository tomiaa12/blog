# JavaScript Date 时间对象-数据类型

## 创建日期

```js
​new Date(); // 英文 星期几 月 日 年 时:分:秒 地区
​new Date(Date.parse("may 25 , 2004")) // 以传入的时间为起始
​new Date(Date.UTC(2005 , 4 , 5 , 17 , 5, 55)) // UTC时间
​new Date("2005,4,5,5,17,5,55") // 本地时间 年月日

​var start = Date.now() // 取得开始时间，调用函数
​var stop = Date.now() // 取得结束时间
​var start1 = new Date(); // 取得开始时间，调用函数
​var stop1 = new Date();// 取得结束时间
​Date.parse("2020-1-3");// 取得传入时间的时间戳
```

如果直接把表示日期的字符串传给`Date`构造函数，那么`Date`会在后台调用`Date.parse()`

## 时间格式化

```js
date.toDateString() // 显示星期几、月、日、年
date.toTimeString() // 显示分、秒、地区
date.toLocaleDateString() // 以特定地图显示星期几、月、日、年
date.toLocaleTimeString() // 以特定地图显示、时、分、秒
date.toUTCString() // 显示完整 UTC 时间
```

## 时间组件

```js
date.getTime(毫秒) // 返回日期的毫秒数
date.setTime() // 以毫秒设置日期，会改变整个日期
date.getFullYear(年) // 取得 4 位数的年份
date.setFullYear() // 设置 4 位数的年份
date.getUTCFullYear() // 返回 UTC 日期的 4 位数年份
date.setUTCFullYear() // 设置 UTC 日期的 4 位数年份
date.getMonth(月) // 取得月份 0 表示 1 月
date.setMonth() // 设置月份 传入月份必须大于 0 超过 11 会增加年份
date.getDate(日) // 取得日期天数 1 - 31
date.setDate() // 设置日期天数
date.getDay(星期) // 取得星期几 0 是星期天
date.getHours(时) // 取得小时 0 - 23
date.setHours() // 设置小时超过 23 会增加天数
date.getMinutes(分) // 取得分钟 0 - 59
date.setMinutes() // 设置分钟数 超过 59 会加小时
date.getseconds(秒) // 取得秒数 0-59
date.setSeconds() // 设置秒数
date.getMilliseconds(毫秒) // 取得毫秒
date.setUTCMilliseconds() // 设置毫秒
date.getTimezoneOffset(UTC相差分钟) // 返回本地时间与UTC时间相差的分钟数
```

## 利用 Date 对象获取某个月有多少天

```js
new Date("2021", "10", -1).getDate()
```

获取 2021 年 9 月份有多少天，字符串 10 月，天数 -1 时会退回至 9 月，getDate 获取当前天数即可，而不再是使用 switch
