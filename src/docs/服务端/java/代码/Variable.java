public class Variable {
  public static void main(String[] args) {
    // 基本数据类型示例
    // 整数类型
    byte exampleByte = 100; // 示例的 byte 类型变量
    short exampleShort = 30000; // 示例的 short 类型变量
    int exampleInt = 100000; // 示例的 int 类型变量
    long exampleLong = 10000000000L; // 示例的 long 类型变量（注意 'L' 后缀）

    // 浮点数类型
    float exampleFloat = 10.5f; // 示例的 float 类型变量（注意 'f' 后缀）
    double exampleDouble = 20.99; // 示例的 double 类型变量

    // 字符类型
    char exampleChar = 'A'; // 示例的 char 类型变量

    // 布尔类型
    boolean exampleBoolean = true; // 示例的 boolean 类型变量


    // 引用数据类型示例
    // 类类型
    String exampleString = "Hello, Java!"; // 示例的 String 类型变量

    // 接口类型（实现接口的类）
    // List<String> exampleList = new ArrayList<>(); // 示例的 List 接口变量（需要 import java.util.*）

    // 数组类型
    int[] exampleArray = { 1, 2, 3, 4, 5 }; // 示例的 int 数组

    // 枚举类型
    enum Days {
      MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }
    Days exampleDay = Days.MONDAY; // 示例的枚举类型变量

  }
}
