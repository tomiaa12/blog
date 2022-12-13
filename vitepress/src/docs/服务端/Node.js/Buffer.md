# Node.js Buffer 缓冲区

```js
// 创建一个 10 字节的 buffer,长度一旦确定不能更改
var buf = Buffer.alloc(10);

// 转成 16 进制存入
buf[0] = 88;// <Buffer 58 00 00 00 00 00 00 00 00 00>
buf[1] = 0xaa; // <Buffer 58 aa 00 00 00 00 00 00 00 00>
buf[10] = 11;// 没有第十位 设置没效果
buf[3] = 256; // 00 
/* 最大 255，255 转 16 进制是 ff; 256 二进制 1 后面八个 0,存的时候取二进制后 8位,二进制 8 个 0 还是 16 进制 00 */

console.log(buf[1]);// 170 0xaa 控制台打印是 10 进制
console.log(buf[1].toString(16)); // aa 16 进制输出

var buf1 = Buffer.allocUnsafe(10); // <Buffer 31 34 11 c9 bf 02 00 00 49 34>
// allocUnsafe 创建 10 字节,但是不清空内存,之前别的程序使用的内存信息在这里面.可能有敏感信息

Buffer.from(str);// 将字符串转换成 Buffer 储存
```
base64 存储
```js
let buf = Buffer.from('字符').toString('base64'); // 存储，转换成 base64
console.log(buf);// 5a2X56ym
let buf1 = Buffer.from(buf,'base64');// buf 是字符串 第二个参数以 base64 存储 
console.log(buf1.toString('utf-8'));// 字符

Buffer.alloc(size);// 创建一个指定大小的 Buffer
Buffer.allocUnsafe(size);// 创建一个指定大小的 buffer，可能包含敏感数据
buf.toString();// 将缓冲区的数据转换成字符串
Buffer.allocUnsafeSlow(size);// 慢，不安全的分配空间
Buffer.byteLength(string, 'utf8');// 获取一个字符串占用内存的大小，默认 utf-8
Buffer.compare(buf1, buf2);// 比较两个 Buffer 是否是同一个
Buffer.concat([buf1,buf2]);// 连接多个 Buffer
Buffer.isBuffer(obj);// 是否是一个 Buffer 返回 true/false
Buffer.isEncoding(encoding);// 返回是否支持 encoding true/false 
Buffer.isEncoding('utf-8');// true
Buffer.isEncoding('utf/8');// false
Buffer.poolSize ;// 缓冲池的预分配的内部 Buffer 实例的大小（以字节为单位）可以修改
```