---
title: interface의 객체지향적 특성
date: 2023-03-29
categories: [객체지향]
tags: [객체지향, Java]
---

`interface`가 갖는 특징들을 객체지향의 특성 네가지와 연관지어 보겠습니다.

## 💻 캡슐화

훌륭한 객체란 내부의 정확한 구현을 모른 채, `interface`만 알면 쉽게 상호작용할 수 있는 객체를 의미합니다. 이런 객체를 만들기 위해서는 객체 외부에서 접근할 수 있는 `interface`와 내부에 은닉화되는 구현을 명확히 분리해서 생각해야 합니다.

```java
interface Car {
    public void speedUp();
    public void speedDown();
}

class CarA implements Car {
    private void somethingBeforeSpeedUpA() {
        //
    }

    private void someThingBeforeSpeedDownA() {
        //
    }

    public void speedUp() {
        somethingBeforeSpeedUpA();
    }

    public void speedDown() {
        someThingBeforeSpeedDownA();
    }
}

class CarB implements Car {
    private void somethingBeforeSpeedUpB() {
        //
    }

    private void somethingBeforeSpeedDownB() {
        //
    }

    public void speedUp() {
        somethingBeforeSpeedUpB();
    }

    public void speedDown() {
        somethingBeforeSpeedDownB();
    }
}
```

위 예시에서 `CarA`와 `CarB`는 관련있는 함수들로 이루어진 집단을 이루고 있으며(캡슐화), 속도를 낮추거나 올리기 전에 동작하는 함수들이 은닉화 되어 있습니다(정보은닉). 사용자는 속도를 조절하기 전에 각 자동차에서 동작하는 내부로직을 알 필요없이 `interface`에 있는 함수만 호출하면 됩니다.

## 💻 추상화

복잡도를 낮추기 위해 단순화하는 과정에서 객체들의 공통된 구현사항들을 `interface`로 분리할 수 있습니다.

```java
interface CaffeinBeverage {
    public void boilWater();
    public void brew();
    public void pourInCup();
    public void addCondiments();
}

class Tea implements CaffeinBeverage {
    public void boilWater() {
        System.out.println("차 물 끓이는 중");
    }

    public void brew() {
        System.out.println("찻 잎을 우려내는 중");
    }

    public void pourInCup() {
        System.out.println("찻 잔에 따르는 중");
    }

    public void addCondiments() {
        System.out.println("레몬을 추가하는 중");
    }
}

class Coffee implements CaffeinBeverage {
    public void boilWater() {
        System.out.println("커피 물 끓이는 중");
    }

    public void brew() {
        System.out.println("커피를 우려내는 중");
    }

    public void pourInCup() {
        System.out.println("커피잔에 따르는 중");
    }

    public void addCondiments() {
        System.out.println("설탕과 우유를 추가하는 중");
    }
}
```

## 💻 상속성

`interface`끼리는 다음과 같이 상속 할 수 있습니다.

```java
interface A {
    public void a();
}

interface B {
    public void b();
}

interface C extends A {
    public void c();
}

interface D extends A, B {
    public void d();
}

class Test1 implements C {
    public void a() {
        //
    }

    public void c() {
        //
    }
}

class Test2 implements D {
    public void a() {
        //
    }

    public void b() {
        //
    }

    public void d() {
        //
    }
}
```

## 💻 다형성

`interface`에 맞춰 프로그래밍을 할 때 가장 중요한 점은 다형성을 활용할 수 있다는 것입니다.  
`interface`에 맞춰 구현하고자 하는 객체는 해당 `interface`를 상속 받게되고 이 때 `interface`는 상위 형식이 됩니다. 상위 형식을 상속 받은 객체의 인스턴스는 다형성에 따라 상위 형식의 타입을 가진 변수에 참조값을 대입할 수 있습니다. 이는 변수를 선언한 곳에서 실제 객체의 정확한 구현을 알 필요가 없음을 의미합니다.

```java
Dog d = new Dog();
d.bark();

Cat c = new Cat();
c.meow();
```

```java
Animal d = new Dog();
d.makeSound();

Animal c = new Cat();
c.makeSound();
```

위의 첫번째 예시는 `interface`에 맞춰 구현하지 않은 것이고, 두번째는 `interface`에 맞춰 구현한 것입니다. 첫번째 예시에서는 변수가 어떤 객체인지 알아야 하지만, 두번째는 알 필요없이 `interface`에 선언된 함수만 호출하면 됩니다.
