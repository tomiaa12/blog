# JDBC

JDBC（Java Database Connectivity）是 Java 访问关系型数据库（MySQL / PostgreSQL / Oracle ...）的一套标准 API。

如果你是前端同学，可以先建立一个直觉：

- 前端通常不会“直连数据库”，而是调用后端接口
- 后端接口内部经常会：**拿连接 → 执行 SQL → 把结果映射成对象/JSON → 返回给前端**
- JDBC 就是后端里“执行 SQL 的那层底座”（很多 ORM/框架最终也会落到 JDBC）

## 你需要准备什么

以 MySQL 为例：

- 本地或远程 MySQL
- 一个数据库、一个表（下面给你一份可直接运行的建库建表 SQL）
- Java 项目里引入 MySQL 驱动（推荐 Maven/Gradle）

### 建库建表（示例）

```sql
CREATE DATABASE IF NOT EXISTS javalearning;
USE javalearning;

CREATE TABLE students (
  id BIGINT AUTO_INCREMENT NOT NULL,
  name VARCHAR(50) NOT NULL,
  gender TINYINT(1) NOT NULL,
  grade INT NOT NULL,
  score INT NOT NULL,
  PRIMARY KEY(id)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO students (name, gender, grade, score) VALUES ('小红', 0, 1, 100);
INSERT INTO students (name, gender, grade, score) VALUES ('小橙', 0, 1, 89);
INSERT INTO students (name, gender, grade, score) VALUES ('小黄', 1, 2, 97);
INSERT INTO students (name, gender, grade, score) VALUES ('小绿', 1, 3, 99);
```

## 引入 MySQL 驱动（推荐 Maven）

```xml
<dependency>
  <groupId>com.mysql</groupId>
  <artifactId>mysql-connector-j</artifactId>
  <version>8.3.0</version>
</dependency>
```

> 你可以把这一步类比成前端的 `npm i xxx`：驱动就是“Java 能跟 MySQL 说话”的客户端库。

## JDBC 基本流程（记住这 4 步）

1. **获取连接**：`DriverManager.getConnection(...)`
2. **准备 SQL**：优先 `PreparedStatement`（不要拼字符串）
3. **执行并处理结果**：查询 `executeQuery()`，增删改 `executeUpdate()`
4. **关闭资源**：用 `try-with-resources` 自动关闭（类似前端的“用完及时释放”）

## 连接数据库（最小示例）

```java
package com.tomiaa;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * 示例代码（kuangyx.cn）
 *
 * @author : tomiaa
 * @website : https://kuangyx.cn
 * @project : kuangyx
 * @package : com.tomiaa
 * @className : JdbcConnectDemo
 */
public class JdbcConnectDemo {
    public static void main(String[] args) {
        // MySQL 8 常见连接串写法（按需调整 host/端口/库名/账号密码）
        String url = "jdbc:mysql://localhost:3306/javalearning"
                + "?useUnicode=true&characterEncoding=utf8"
                + "&useSSL=false"
                + "&serverTimezone=Asia/Shanghai";

        try (Connection conn = DriverManager.getConnection(url, "root", "12345")) {
            System.out.println("连接成功：" + !conn.isClosed());
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

> 说明：新版本驱动通常会自动注册，不一定需要显式 `Class.forName(...)`。如果你遇到“找不到驱动”的异常，再加上它。

## 为什么要用 PreparedStatement（前端也该懂）

不要这样写（拼 SQL 字符串）：

```text
"SELECT * FROM users WHERE name = '" + name + "'"
```

原因：**SQL 注入**（类似你把用户输入直接拼进 `innerHTML` 产生 XSS 的风险）。

正确姿势：用 `?` 占位符 + `PreparedStatement` 绑定参数。

## CRUD：查询 / 新增 / 删除 / 更新

先定义一个简单的实体类（POJO），用来承接查询结果：

```java
package com.tomiaa;

public class Student {
    public long id;
    public String name;
    public int gender;
    public int grade;
    public int score;
}
```

再写一个工具类，统一管理连接（真实项目一般会用连接池，这里先讲清楚 JDBC 本身）：

```java
package com.tomiaa;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Db {
    private static final String URL = "jdbc:mysql://localhost:3306/javalearning"
            + "?useUnicode=true&characterEncoding=utf8"
            + "&useSSL=false"
            + "&serverTimezone=Asia/Shanghai";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, "root", "12345");
    }
}
```

### 查询（SELECT）

```java
package com.tomiaa;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class QueryDemo {
    public static void main(String[] args) throws Exception {
        String sql = "SELECT id, name, gender, grade, score FROM students WHERE grade >= ?";

        try (Connection conn = Db.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, 2);

            List<Student> list = new ArrayList<>();
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Student s = new Student();
                    // 注意：JDBC 的列索引从 1 开始；更推荐按列名取值，可读性更好
                    s.id = rs.getLong("id");
                    s.name = rs.getString("name");
                    s.gender = rs.getInt("gender");
                    s.grade = rs.getInt("grade");
                    s.score = rs.getInt("score");
                    list.add(s);
                }
            }

            System.out.println("查询条数：" + list.size());
        }
    }
}
```

### 新增（INSERT）

```java
package com.tomiaa;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class InsertDemo {
    public static void main(String[] args) throws Exception {
        String sql = "INSERT INTO students(name, gender, grade, score) VALUES(?, ?, ?, ?)";

        try (Connection conn = Db.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, "小蓝");
            ps.setInt(2, 0);
            ps.setInt(3, 3);
            ps.setInt(4, 100);

            int rows = ps.executeUpdate();
            System.out.println("影响行数：" + rows);
        }
    }
}
```

### 删除（DELETE）

```java
package com.tomiaa;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class DeleteDemo {
    public static void main(String[] args) throws Exception {
        String sql = "DELETE FROM students WHERE id = ?";

        try (Connection conn = Db.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, 101);
            int rows = ps.executeUpdate();
            System.out.println("删除行数：" + rows);
        }
    }
}
```

### 更新（UPDATE）

```java
package com.tomiaa;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class UpdateDemo {
    public static void main(String[] args) throws Exception {
        String sql = "UPDATE students SET name = ? WHERE id = ?";

        try (Connection conn = Db.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, "tomiaa");
            ps.setLong(2, 201);
            int rows = ps.executeUpdate();
            System.out.println("更新行数：" + rows);
        }
    }
}
```

## 事务（Transaction）：要么都成功，要么都回滚

你可以把事务理解成：一组操作的“原子提交”。前端常见类比是：

- 你在页面上点“提交订单”
- 后端需要：扣库存 + 写订单 + 写支付记录
- 这 3 件事必须“要么都成功，要么都失败”，否则数据就乱了

JDBC 事务最常用三句：

- `conn.setAutoCommit(false)`：关闭自动提交
- `conn.commit()`：提交
- `conn.rollback()`：回滚

```java
package com.tomiaa;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class TxDemo {
    public static void main(String[] args) throws Exception {
        String sql = "UPDATE students SET score = score + ? WHERE id = ?";

        try (Connection conn = Db.getConnection()) {
            conn.setAutoCommit(false);

            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, 1);
                ps.setLong(2, 201);
                ps.executeUpdate();

                // 模拟中间出错
                // if (true) throw new RuntimeException("boom");
            }

            conn.commit();
            System.out.println("提交成功");
        } catch (Exception e) {
            // 注意：rollback 需要在同一个 conn 上执行，所以真实项目一般会更细致地组织 try/catch
            e.printStackTrace();
        }
    }
}
```

## 连接池（Connection Pool）：别每次都 new 连接

连接数据库是昂贵操作。如果每个请求都“创建连接 → 用完关闭”，高并发下会很慢。

连接池的思路很像前端的“复用昂贵资源”：

- 预先创建一批连接放进池子里
- 用的时候借一个，用完归还

常见连接池：

- **HikariCP**（Spring Boot 默认）
- Druid
- C3P0（较老）

> 本文重点讲 JDBC 基础概念；实际项目里你大概率会通过 Spring / MyBatis / JPA 来间接使用连接池。

## 常见坑

- **字符编码/时区问题**：建议在 URL 里加 `characterEncoding=utf8`、`serverTimezone=Asia/Shanghai`
- **ResultSet 下标从 1 开始**：更推荐用列名读取，少踩坑
- **资源必须关闭**：用 `try-with-resources`，别手写一堆 finally
- **永远用 PreparedStatement**：避免注入 + 更好复用执行计划
- **不要把密码写死在代码里**：用配置文件/环境变量（像前端的 `.env`）

## 总结

- JDBC 是 Java 访问数据库的底层标准 API
- 牢记 4 步：连接 → 预编译 SQL → 执行 → 关闭
- 安全第一：`PreparedStatement`（防注入） + 合理的事务边界
