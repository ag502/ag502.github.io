---
title: 오버라이딩
date: 2023-03-30
categories: [객체지향]
tags: [객체지향, Java]
---

## 💻 오버라이딩이란?

상속을 통해 `super class`와 `sub class` 관계가 형성된 두 클래스에서 `sub class`가 `super class`의 속성과 함수를 그대로 사용할 수도 있지만, `sub class`에서 재정의하여 사용할 수도 있습니다. 이렇게 재정의하는 것을 `overriding`이라고 합니다.

```java
public abstract class CaffeineBeverageWithHook {
    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        if (customerWantsCondiments()) {
            addCondiments();
        }
    }

    public abstract void brew();

    public abstract void addCondiments();

    public void boilWater() {
        System.out.println("물 끓이는 중");
    }

    public void pourInCup() {
        System.out.println("컵에 따르는 중");
    }

    public boolean customerWantsCondiments() {
        return true;
    }
}

public class CoffeeWithHook extends CaffeineBeverageWithHook {
    // abstract class 구현

    public boolean customerWantsCondiments() {
        System.out.println("재정의");
        return false;
    }
}
```

위 예시는 `sub class`인 CoffeeWithHook에서 `super class`인 CaffeineBeverageWithHook에서 물려 받은 `customerWantsCondiments` 함수를 그대로 사용하지 않고, 재정의해 사용하고 있는것을 볼 수 있습니다.

## 💻 @Override

`Java`에서는 오버라이드하는 함수에 `@Override`를 명시해 줄 수 있습니다. 하지만 이는 생략되어도 정상동작 합니다.

그럼에도 불구하고 어노테이션을 붙여주는 이유는 다음과 같습니다.

### 👨‍💻 안전핀 역할

```java
class Parent {
    public void hello(String name) {
        System.out.println("안녕하세요");
    }
}

class Child extends Parent {
    public void hello() {
        System.out.println("안녕~")
    }
}
```

위 예시는 `sub class`에서 `hello` 함수 파라미터를 설정해 주지 않아 오버라이딩이 제대로 되지 않은 상황입니다. 의도와는 다르지만 위 예시는 정상동작 합니다.
`hello` 함수를 `Child`에서 선언한 함수로 인식하기 때문입니다.

만약 위 상황에서 `@Override` 어노테이션을 명시할 경우 컴파일 오류가 발생하고 사전에 실수를 방지할 수 있습니다.

### 👨‍💻 가독성

`@Override` 어노테이션을 명시함으로써 해당 함수가 `super class`의 함수를 오버라이딩 했음을 쉽게 파악할 수가 있습니다.
