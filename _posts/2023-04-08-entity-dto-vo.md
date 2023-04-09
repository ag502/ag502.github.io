---
title: Entity, DTO, VO
date: 2023-04-08
categories: [Spring]
tags: [객체지향, Java, Spring]
---

## 💻 Entity

실제 DB의 테이블과 매핑되는 클래스로 `id`값으로 구분이되며, 로직을 포함할 수 있습니다.

아래의 예시는 JPA를 활용한 `Entity` 코드 입니다.

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    public User() {}

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        return this.email = email;
    }
}

```

코드에서 볼 수 있듯이 DB의 필드들이 클래스 내의 속성으로 들어가 있는것을 알 수 있습니다.

## 💻 DTO (Data Transfer Object)

계층간 데이터 교환을 위해 사용하는 객체로 로직을 갖지 않으며, `getter/setter` 메소드만 갖는 객체입니다.

```java
public class UserDTO {
    private Long id;
    private String name;
    private String email;

    public UserDTO(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
```

위 예시에서 볼 수 있듯이 특별한 로직 없이 `getter/setter` 메서드만 있는것을 알 수 있습니다.

## 💻 VO (Value Object)

값을 표현하는 객체로 로직을 포함할 수 있는 객체입니다.  
`VO`는 객체의 불변성 보장하며, 서로 다른 인스턴스여도 내부의 속성값이 같다면 같은 객체로 간주합니다. 내부 속성이 같을때 같은 인스턴스로 처리하기 위해서는 반드시 `VO` 내부에서 `equals()`와 `hashCode()`를 오버라이딩 해주어야 합니다.

```java
public class Email {
    private String value;

    public Email(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Email value cannot be null");
        }
        if (!isValidEmail(value)) {
            throw new IllegalArgumentException("Invalid email format: " + value);
        }
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Email email = (Email) o;
        return Objects.equals(value, email.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
```

위 코드에서와 같이 `VO`는 로직을 포함할 수 있으며, `setter`메소드를 구현하지 않아 불변성을 유지할 수 있습니다.
또한 속성값이 같을 경우 인스턴스들이 동일함을 알려줄 수 있도록 `equal`을 오버라이딩해서 구현했음을 볼 수 있습니다.
