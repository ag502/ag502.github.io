---
title: 객체지향의 네가지 특성
date: 2023-03-28
categories: [객체지향]
tags: [객체지향, Java]
---

## 💻 캡슐화

데이터(속성)와 함수가 응집력있게 구성된 집단을 만드는 것을 캡슐화라고 합니다. 캡슐화를 통해서 각 집단들을 구분지을 수 있습니다. 집단을 만드는 과정에서 데이터는 숨겨지고, 일부 함수만 외부에 노출되는데 캡슐화를 정보은닉이라고 부를 수 있는 이유는 이런 이유에서 입니다.

```java
class Circle {
  private int rad;
  Point center;

  public Circle(int x, int y, int r) {
    center = new Point(x, y);
    rad = r;
  }

  public void showCircleInfo() {
    System.out.println("radius: " + rad);
  }
}
```

위의 예시 코드에서는, 관련된 데이터와 함수들을 이용해 `Circle`라는 집단을 만들었으며 `rad` 데이터는 외부로부터 숨겼음을 알 수 있습니다.

## 💻 추상화

추상화란 세부 사항이나 구조를 명확하게 이해하기 위해 특정 절차나 물체를 의도적으로 생략하거나 감춤으로써 복잡도를 극복하는 방법입니다. 다시말해서, 복잡한 대상을 이해하기 쉽게 단순화 시키는 것입니다.

```java
abstract class Car {
  abstract void accelerate();
}

class Ionic extends Car {
  public void accelerate() {
    System.out.println("Ionic accelerate");
  }
}

class Casper extends Car {
  public void accelerate() {
    System.out.println("Casper accelerate");
  }
}
```

위 예시 코드에서, `Ionic`과 `Casper`는 `Car`의 종류들이고 `accelerate`라는 공통적인 기능을 가지고 있습니다. 따라서 이를 추상화하여 분리하면 `Car`라는 추상 클래스가 만들어 집니다.

## 💻 상속성

기존의 객체(클래스)를 활용하여, 유사한 구현을 갖는 새로운 객체(클래스)를 재정의 할 수 있는 특성입니다.  
기존에 존재하는 클래스를 `super class`라고 하며, `super class`에서 파생된 클래스를 `sub class`라고 합니다. `sub class`는 `super class`의 데이터 및 함수를 사용 및 확장할 수 있으며, 이를 통해 재사용성을 높일 수 있습니다.

```java
class Duck {
    fly() {
        System.out.println("오리가 날고 있습니다.");
    }

    quack() {
        System.out.println("오리가 꽥꽥 울고 있습니다.");
    }
}

class MallardDuck extends Duck {
    // 
}

class Main {
    public static void main(String[] args) {
        MallardDuck mallardDuck = new MallardDuck();
        mallardDuck.fly();
    }
}
```

위의 예시에서 `MallardDuck`은 `fly`함수를 선언하지 않았음에도 인스턴스가 해당 함수에 접근해 실행하는 것을 볼 수 있습니다. 이는 `MallardDuck`이 `Duck`의 `sub class`이기 때문입니다.


## 💻 다형성

하나의 타입으로 여러 타입을 표현할 수 있는 객체지향의 특징을 다형성이라고 합니다.  
상속을 통해 `super class` `sub class` 관계가 형성된 클래스들에서, `super class` 타입의 참조변수로 `sub class` 객체를 참조할 수 있는데 이는 다형성으로 인해 가능한 일 입니다.

```java
abstract class Animal {
    abstract void makeSound();
}

class Dog extends Animal {
    public void makeSound() {
        bark();
    }

    public void bark() {
        System.out.println("왈왈");
    }
}

class Main {
    public static void main(String[] args) {
        Animal animal = new Dog();

        animal.makeSound();
    }
}
```

위 예시 코드에서 `Animal`은 `Dog`의 `super class`이므로 `Dog`의 인스턴스를 `Animal` 타입에 할당할 수 있습니다.