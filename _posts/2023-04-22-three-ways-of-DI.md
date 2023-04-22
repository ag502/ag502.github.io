---
title: DI의 세가지 방법
date: 2023-04-22
categories: [Spring]
tags: [Spring]
---

`DI`는 [DI와 Ioc](https://ag502.github.io/posts/di-and-ioc/)글에서 살펴보았듯이 객체를 외부에서 생성해 주입하는 것을 의미합니다.  
이 글에서는 `Spring`에서 사용할 수 있는 `DI`의 세가지 방법에 대해 알아보겠습니다.

## 💻 Constructor Injection (생성자 주입)

클래스의 생성자를 통해 의존성을 주입하는 방법입니다. 이 방법은 생성자 파라미터에 주입할 의존성 객체를 명시해주게 됩니다.

```java
@Service
public class MyService {
    public MyService(MyRepository myRepository) {
        this.myRepository = myRepository;
    }
}
```

## 💻 Setter Injection (Setter 메서드를 통한 주입)

`Setter` 메서드를 통해 의존성을 주입하는 방식입니다.

```java
@Service
public class MyService {
    public void setMyRepository(MyRepository myRepository) {
        this.myRepository = myRepository;
    }
}
```

## 💻 Annotation Injection (어노테이션을 이용한 주입)

`Spring`이 지원하는 `annotation`을 이용해 의존성을 주입하는 방식으로, 조금더 자세히 표현하자면 `annotation` 과 필드 객체를 이용해 의존성을 주입하는 방식입니다.

```java
@Service
public class MyService {
    @Autowired
    private MyRepository myRepository;
}
```

위 예시와 같이 `Spring`의 `@Autowired` `annotation`을 활용하여 의존성을 자동으로 필드 객체에 주입하고 있음을 알 수 있습니다.

위 세가지 방법중 `Spring` 공식문서에서는 첫 번째 방법, 즉 생성자를 통한 의존성 주입을 권장하고 있습니다.  
`annotation`을 이용한 의존성 주입은 테스트의 어려움과 어떤 의존성을 가지는지 명확하게 파악하기가 어려워 권장하지 않습니다.
