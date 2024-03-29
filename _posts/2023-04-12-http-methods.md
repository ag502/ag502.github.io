---
title: HTTP 메서드
date: 2023-04-12
categories: [네크워크]
tags: [네트워크]
---

## 💻 HTTP

`HTTP` 프로토콜은 신뢰성 있는 데이터 전송 프로토콜로 수십억개의 이미지, `HTML` 페이지, 텍스트 파일, 동영상, 음성 파일등과 같은 대량의 데이터를 빠르고 정확하게 사용자의 브라우저에 옮겨주는 역할을 합니다.  
`HTTP` 프로토콜은 메세지를 통해 데이터를 주고 받습니다. `HTTP` 메세지는 클라이언트로부터의 요청이나 서버로부터의 응답 중 하나를 포합니다. 메세지의 구조는 `시작줄`, `헤더`, `본문` 세부분으로 구성되어 있으며 `본문`은 없을수도 있습니다.

```
<!-- 요청 메세지 -->
<메서드> <요청 URL> <버전>
<헤더>

<엔티티 본문>

<!-- 응답 메세지 -->
<버전> <상태 코드> <사유 구절>
<헤더>

<엔티티 본문>
```

위의 예시는 각각 요청과 응답의 `HTTP` 메세지가 갖는 구조 입니다.

## 💻 메서드

클라이언트가 서버쪽으로 보내는 `HTTP` 메세지의 시작줄에 있으며, 클라이언트가 서버에게 기대하는 동작을 의미합니다. 다시말해 서버에게 무엇을 해야 하는지 말해주는 역할을 합니다.

### 🙋‍♂️ GET

가장 흔하게 사용하는 메서드로 서버에서 리소스를 요청할 때 사용합니다. 해당 요청 메세지의 `본문`은 없습니다.

### 🙋‍♂️ HEAD

`GET`과 동일하게 행동하지만, 서버는 응답으로 헤더만 돌려줍니다. 즉 `본문`이 반환되지 않습니다.  
`HEAD` 메서드를 사용하면 리소스를 가져오지 않고도 헤더만 조사할 수 있습니다. 이를 통해 리소스가 변경되었는지를 확인하거나 개체의 존재 유무를 알 수 있습니다. 요청 메세지의 `본문`은 없습니다.

### 🙋‍♂️ PUT

`GET`과는 반대로 서버에 정보를 저장하는 역할을 합니다. `PUT` 메서드의 의미는 서버가 요청의 `본문`을 가지고 요청 URL의 이름대로 새 문서를 만들거나, 이미 존재하는 URL이라면 교체하는 것입니다. 요청 메세지에 본문이 있습니다.

### 🙋‍♂️ POST

`POST` 메서드는 서버에 입력 데이터를 전송하기 위해 설계되었습니다. `PUT` 메서드와 유사하지만, `POST`는 서버에 데이터를 보내기 위해 사용하는 반면, `PUT`은 서버에 있는 리소스에 데이터를 입력하기 위해 사용합니다.
서버가 처리해야할 데이터를 보낼 때 사용합니다. 요청 메세지에 `본문`이 있습니다.

### 🙋‍♂️ TRACE

메세지가 프록시를 거쳐 서버에 도달하는 과정을 추적할 때 사용합니다. 요청 메세지에 `본문`이 없습니다.

### 🙋‍♂️ OPTIONS

서버에서 어떤 메소드를 수행할 수 있는지 확인할 때 사용하며, 요청 메세지에 `본문`이 없습니다.

### 🙋‍♂️ DELETE

서버에서 요청 URL로 지정한 리소스 제거를 요청할 때 사용하며, 요청 메세지에 `본문`이 없습니다.

### 🙋‍♂️ CONNECT

`CONNECT` 메소드는 요청한 리소스에 대해 양방향 연결을 시작하는 메소드입니다.
