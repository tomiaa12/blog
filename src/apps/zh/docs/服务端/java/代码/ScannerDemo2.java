import java.util.Scanner;

public class ScannerDemo2 {
  public static void main(String[] args) {

    Scanner sc = new Scanner(System.in);
    System.out.println("输入一个三位数");

    int num = sc.nextInt();

    System.out.println(num % 10); // 个
    System.out.println(num / 10 % 10); // 十
    System.out.println(num / 100 % 10); // 百
  }
}
