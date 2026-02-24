# JavaScript ES6 class 类

1. `constructor`内外都可以定义属性，前面加`static`为静态属性
2. 类里面，`方法(){}`为成员方法，加`static`为静态方法`constructor`内`this.方法()`为实例方法
3. 继承父类方法使用`extends`，子类没有`constructor`时会默认调用父类的`constructor`
4. 子类`constructor`内使用`this`之前必须调用`super()`方法把父类的`this`继承下来
5. 成员属性、方法、静态属性、方法也会继承下来。子类使用父类方法可以`super.方法名`，也可以`this.方法`
6. 子类用`super.父类属性`，也可以使用`this`来获取
7. 静态方法不能访问成员属性，成员方法不能访问静态属性

```js
class Person {
  name;// 成员属性
  static age = 2;// 静态属性
  constructor(name,age){
    this.name = name;
    this.age = age; // 这里 this.age 指向实例的 age
  }

  fn(){
    // 成员方法(原型上)
    console.log(this.age + Person.age);
  }
  static fn1(){
    // 静态方法 只能使用 Person.fn1()来调用
    console.log(this.age === Person.age); // true
  }
}

class Son extends Person{
  constructor(name,age,sex){
    super(name,age);// this之前调用super
    super.fn();// 调用父类方法
    this.sex = sex;
  }

  fn(){
    // 重写父类方法
  }
  static ff(){
    super.fn1();// 调用父类静态方法
  }
}

// 不可继承常规对象。
var Father = {
  // ...
}
class Child extends Father {
  // ...
}
// Uncaught TypeError: Class extends value #<Object> is not a constructor or null

// 解决方案
Object.setPrototypeOf(Child.prototype, Father);
```
