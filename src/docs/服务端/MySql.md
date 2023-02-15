# MySql 数据库常用命令

## 1、启动/关闭 Mysql 服务

```sh
net start mysql // 启动服务
net stop mysql // 停止服务
```

## 2、链接 MySQL

mysql -h主机地址 -u用户名 －p用户密码

```sh
mysql -h localhost -u root -p 
// -h 链接 host 的IP地址 默认 localhost 本机
// -u 用户名 -user root
// -p 密码 -password 密码
exit  退出MySQL
```
:::tip 注意
-h和主机地址、-u用户名 中间可以不加空格,-p 后面必须要加。-p后面不输入密码 第二行可以输入***遮盖的密码
:::

## 3、修改密码

```sh
mysqladmin -u用户名 -p旧密码 password 新密码
```
:::tip 注意
-u用户名、 -p旧密码 中间不能有空格 例如 -uroot -proot 否则会修改不成功
如果刚开始安装没有设置密码 -p旧密码一项可以省略。
:::

```sh
update mysql.user set authentication_string='新密码' where user='root';
```

## 4、忘记密码

密码存放在 mysql 库，user 表中。旧版密码的字段是 password

1. 进入安装目录的 bin下启动 cmd
2. 任务管理器结束 mysqld.exe 进程
3. mysqld --skip-grant-tables 回车
4. 输入 mysql 回车直接进入
5. 安装的 MySQL 的目录下，找 my.ini 文件；
6. 在 [mysqld] 后添加一行skip-grant-tables
7. 重启 MySQL 服务器。
8. 登录 mysql，键入mysql –uroot –p；直接回车（Enter）无需密码
9. update mysql.user set authentication_string='新密码' where user='root';

## 5、用户管理

增加新用户

```sh
grant 权限 on 数据库.* to 用户名@登录主机 identified by "密码"
grant select,insert,update,delete on *.* to user1@localhost Identified by "password1";
```

[查询、插入、修改、删除]    [所有数据库] 用户名 user@ 本机       [密码] 

:::tip 注意

设置所有地方都可以登录 localhost 替换成 %

设置没有密码 把 password1

:::

## 6、操作库

```sh
show databases; // 显示库列表
use 数据库名; // 打开/选择库
create database 库名字;// 创建库
drop database 库名; // 删除库 不存在会报错
drop database if exists 库名; // 删除库 加 if exists 判断,不存在也不会产生错误
```

:::warning 错误信息

ERROR 1008 (HY000): Can't drop database 'drop_database'; database doesn't exist

发生错误，不能删除'drop_database'数据库，该数据库不存在。

 Query OK, 0 rows affected, 1 warning (0.00 sec)

产生一个警告说明此数据库不存在

:::

创建库并分配给用户,依次执行3步:

1. create database 库名;
2. grant select,inseter,update,delete,create,drop,alter, on 数据库名.* to 数据库名 @localhost identified by '密码';
3. set password for '数据库名'@'localhost' = old_password('密码');

## 7、操作表

```sh
show tables;// 显示表
drop table 表名;// 删除表
desc 表名; // 显示表结构 [表的字段及类型]
create table `表名`(字段名:类型,[字段名n:类型n...]); // 创建表 
```

:::tip 注意
\`表名` 表名/字段名可能有关键字,加上``反引号变成无意义的字符串
:::

例子 :

```sh
create table mydemo(
  id int(4) [not null] [primary key] [auto_increment] [default "默认"],
  // 字段 整形(长度) [不能为空] [设置为主键] [自动递增]   [默认值]
  degree double(16,2)
)[character set utf8];
```

```sh
// 修改表名
rename table 原表名 to 新表名;

// add 添加字段
alter table 表名 add 字段名 数据类型 其他(创建表的可选项一样);

// 修改字段
alter tabler 表名 change 旧字段 新字段 [类型、其他];

// 删除字段
alter table 表名 drop 字段名;

// index 添加索引
alter table 表名 add index 索引名 (字段名,[字段名n...]);

// 加唯一限制条件的索引
alter table 表名 add unique 索引名 (字段名);

// 加主关键字的索引 把某个字段加上主键
alter table 表名 add primary key (字段名);

// drop 删除索引
alter table 表名 drop index 索引名;
```

## 8、操作表中数据

插入一行数据

```sh
insert into 表名(字段名,[字段名n]) values('对应字段名的值',['对应字段名n的值']);
```

当添加一行数据时全部字段都要填的时候, (字段名,[字段名n]) 可以简写

```sh
insert into 表名 values('值','值2');// 值的顺序不能错
```

:::tip 注意

insert一次只能插入一行数据 

:::

单表查询

```sh
select */字段名/函数/字符串 from 表名 [[where条件] [group by 字段名] [order by 字段名] [asc/desclimit matchMedia] [m,n] [having 条件] ]
```

删除行数据

```sh
delete from 表名 [where 表达式];
```

修改行数据

```sh
update 表名 set 字段='值',[字段n='值'] [where 表达式];
```

:::tip 注意

如果没有where语句,将更新所有的行

:::

## 9、单表查询

select */字段名/函数/字符串 [as 别名] from 表名\[not 排除][ where 条件 group by 字段名 order by 字段名 asc/desc limit m,n havimg 条件 ]

```sh
select * 所有字段
select name 查询名字为name的字段
select '每一行都显示' 每一行都显示字符串的内容
select count(字段) 统计字段的行数/个数
select sum(字段) 求和
select max(字段) 最大值
select min(字段) 最小值
select avg(字段) 平均值
select distinct 字段 // 去重, 查询后字段重复的被去除
select concat('字符串', 字段名) 拼接成新的字符串
```

where条件
```sh
where age='20' age为20的

// 或
where sx='a' || sx='b' sx等于'b' 或 sx等于'b'
where sx='a' or sx='b' sx等于'b' 或 sx等于'b'
where sx in('a','b')    sx等于'b' 或 sx等于'b'

// 且
where cj>=60 and cj<=80 cj大于等于60,小于等于80的
where cj>=60 && cj<=80 cj大于等于60,小于等于80的

// 区间
where cj between 60 and 80 cj在60至80之间 包含60,80

// 不等于
where sx<>'计算机系' 不是计算机系的
where sx!='计算机系' 不是计算机系的

// is 查询 null
where sx is null 查询为null的
where sx is not null 查询不为null的

// 模糊查询
% 表示0或n个字符
_ 表示一个字符
where xm like '%王%' xm包含王字的
where xm like '王%' xm王开头的
where xm like '王_' xm王开头后面一个字的
```

分组

```sh
group by 字段
select count(sex) from 表名 group by sex; // 统计 sex 男女多少人
```

排序

```sh
order by 字段 asc/desc 
asc 升序 desc 降序  默认asc
```

动态排序

```sh
order by age asc,cj desc ;// age 升序,第二cj 降序
```

随机排序

```sh
order by rand()
```

对结果集进行筛选，查询后的结果

```sh
having 条件
```

显示条数/游标

```sh
limit m,n
```

m 代表游标，一列的字段为 0，第一行为 1，第二行为 2

n 为显示的行数

只有一个条件时,就表示显示几列。默认 m 是 0 开始

分页的公式（页数 -1） * 每页显示的行数

## 10、连表查询

全连表

```sh
select * from 表名1 inner join 表名2 on 条件 [inner join 表名3 on 条件] [where 条件] 

连接两个表查询, 条件可以设置相等值关联 如 表1.id=表2.id 只显示满足条件的结果
select * from xsb inner json cjb on xsb.id=cjb.id;

可以给表名起别名 as
select * from xsb as a inner json cjb as b on a.id=b.id;
```

左连表

```sh
select * from 表名1 left join 表名2 on 条件 [left join 表名3 on 条件] [where 条件] 
第一个表全部显示，后面的表满足 on 条件的会出现在结果集上。不满足的以 null 显示
```