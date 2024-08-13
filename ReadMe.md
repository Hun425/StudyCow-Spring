# 📖 공부 했소?



![Preview__1_](/uploads/56ee77c2c6b8817d77d9fc5591245da6/Preview__1_.png)


<br>

## 프로젝트 소개

- **성적 관리** 및 **동기 부여**가 필요한 학생을 위한 통합 서비스
- 온라인 그룹 스터디를 위한 캠 스터디 및 손 감지 타이머 기능
- 자율 학습 관리를 위한 플래너 및 성적 기반 자동 생성 기능
- 학생 동기부여를 위한 성적관리 및 게이미피케이션 & 랭킹 기능

<br>

## 팀원 구성

<div align="center">

| **채기훈** | **황민채** |
| :------: |  :------: |
| [<img src="https://avatars.githubusercontent.com/Hun425?v=4" height=150 width=150><br/> @Hun425](https://github.com/Hun425) | [<img src="https://avatars.githubusercontent.com/trick0846?v=4" height=150 width=150> <br/> @trick0846](https://github.com/trick0846) |

</div>

<br>

## 1. 개발 환경 및 요구사항 명세

### Front 
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
 <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> 

### Back-end  
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> <img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"> <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> 


### 버전 및 이슈관리 

 <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> 

### 협업 툴 

 <img src="https://img.shields.io/badge/jira-0052CC?style=for-the-badge&logo=jira&logoColor=white"> <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=Discord&logoColor=white"> <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white">

### 인프라 

<img src="https://img.shields.io/badge/aws-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white">  <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white"> <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">

### 성능 관리 및 모니터링 

 <img src="https://img.shields.io/badge/grafana-009639?style=for-the-badge&logo=grafana&logoColor=white"> <img src="https://img.shields.io/badge/prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white"> <img src="https://img.shields.io/badge/sonarqube-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white">


### 디자인 
 [Figma](https://www.figma.com/file/fAisC2pEKzxTOzet9CfqML/README(oh-my-code)?node-id=39%3A1814)

<br>

| 요구사항 명세 |
|----------|
|[C202_기획_-_요구사항_분석.pdf](/uploads/ca0b0ab2ca0f997d66a5dbebef92a436/C202_기획_-_요구사항_분석.pdf)|

### 요구사항 명세 요약

- 캠 스터디 방: 사용자들이 화면을 공유하며 함께 공부할 수 있는 온라인 스터디 룸 생성 및 관리
- 스터디 플래너: 개인 및 그룹 학습 계획 수립, **AI 기반 학습 전략 추천**
- 성적 관리: 성적 입력, 분석 및 목표 설정 기능
- 타임 트래킹:  **AI 손 인식 기반 공부 시간** 측정 및 랭킹 시스템
- 사용자 관리: 회원가입, 로그인, 프로필 관리
- 커뮤니티 기능: 친구 추가, 친구 대시보드 확인


<br>

## 2. 채택한 개발 기술과 브랜치 전략


### Spring

- 향후 서비스 확장시 유연하게 대처하기 위한 Java 기반 Spring Framework 선택


### JDK17

- record 기능을 사용한 Dto 및 instancof 패턴 매칭을 위한 JDK17버전 선택

### React

- Vue.js 보다 자유로운 편집 및 커스텀을 위한 React 선택


### 브랜치 전략

- 기본적인 역할분담은 Jira 및 WBS를 통해 세분화
- 각 세분화된 기능들을 branch로 생성해 main에 merge 하는 방식으로 협업을 진행
- dev 와 master branch를 분리하고, master는 자동 배포용 dev는 개발용으로 branch를 분리


<br>

## 3. DB 설계


| ERD |
|----------|
|![StudyCow_ERD__1_](/uploads/07b4c9a8b02cdf507700b6a59f9358a7/StudyCow_ERD__1_.png)|

## 4. 일정 관리

| WBS |
|----------|
|[C202_기획_-_WBS.pdf](/uploads/8c483dad261c1ec352e4ac540b12852b/C202_기획_-_WBS.pdf)|



<br>

## 4. 역할 분담

    
### 👻채기훈 (조장)

- **구현 기능**
    - 인프라 CI/CD 자동화, 회원 API, 실시간 채팅 API, 신체 인식 AI, 플래너 API, Custom 예외처리 구현, 서버 모니터링

- **세부 기술 & 라이브러리**

<img src="https://img.shields.io/badge/springsecurity-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"> <img src="https://img.shields.io/badge/jsonwebtokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"> <img src="https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white"> 


<br>



### 🐬황민채


- **기능**
    - 프론트앤드 SPA View 및 Component 구성, CSS 디자인 및 Props 연결, 비동기 동작 처리
    
<br>

## 5. 개발 기간 및 작업 관리

### 개발 기간

- 전체 개발 기간 : 2024-07-01 ~ 2024-08-15
- 기획 및 설계 : 2024-07-01 ~ 2024-07-12
- 기능 구현 : 2024-07-15 ~ 2024-08-09
- UI 구현 : 2024-07-15 ~ 2024-08-13


<br>

### 작업 관리

- Jira + WBS 를 사용하여 업무를 세부적으로 분담
- Notion 및 Swagger를 사용하여 API 명세서를 작성
- Gitlab branch를 사용하여 협업을 진행
- 코드 및 커밋 컨벤션을 지정해 코드 품질 관리와 의사소통에 집중

<br>

## 7. 페이지별 기능

### [메인페이지]




| 메인페이지/비로그인 |
|----------|
||

- 공부했소?의 서비스를 간단히 소개합니다.
- Start를 누르면 회원가입으로 바로 이동합니다.


| 메인페이지/로그인 |
|----------|
||

- 사용자의 프로필 및 활동 내역을 요약해서 보여줍니다.


<br>


### [네비게이션 바]



| 네비게이션 바 |
|----------|
||

- 각각의 기능을 담당하는 페이지로 이동시켜줍니다.

<br>

###  [로그인/회원가입 페이지]

| 로그인 |
|----------|
||

- 사용자의 정보를 받고 로그인을 성공하면 메인페이지로 리다이렉트합니다.

| 회원가입 |
|----------|
||

- 각각의 기능을 담당하는 페이지로 이동시켜줍니다.


<br>

###  [추천]


| 추천 |
|----------|
|![추천 영화 페이지](https://github.com/Hun425/finalpjt/assets/147483675/a4331d01-d881-4b35-a9d3-c0a8b596dfa7)|

- 사용자에게 맞는 영화를 랜덤으로 최대 10개를 뽑아서 추천해줍니다.
- 추천 기준은 사용자의 나이 등급에 맞는 영화 중에서, 사용자가 좋아요를 누른 영화 목록 중 가장 많이 선택한 장르로 추천해줍니다.
- 사용자가 좋아요를 누른 영화가 5개 이하 일때는 추천해주지 않습니다.

<br>

###  [커뮤니티]


| 커뮤니티 |
|----------|
|![커뮤니티 페이지](https://github.com/Hun425/finalpjt/assets/147483675/797d0105-feaf-4b3b-aced-46cdaac369a7)|

- 작성된 모든 리뷰를 최신순으로 보여줍니다.
- 작성된 리뷰의 영화 포스터, 리뷰 제목, 리뷰 줄거리 요약, 좋아요 개수, 댓글 개수를 보여줍니다.
- 리뷰 카드를 누르면 해당 리뷰가 적힌 페이지로 이동합니다.

<br>

###  [영화 검색]



| 영화 검색 |
|----------|
|![영화 검색](https://github.com/Hun425/finalpjt/assets/147483675/c912ad9c-3af2-43aa-afd3-ee6728dd8bb8)|

- 사용자가 원하는 영화를 한글로 입력하면 레벤슈타인 알고리즘을 사용해 데이터베이스에 있는 영화중에 입력한 글자와 유사한 영화를 보여줍니다.
- 결과를 클릭하면 해당 영화의 링크로 이동합니다.
- 초성으로 검색하면 es-hangul 라이브러리를 사용해, 초성이 포함된 유사한 영화들을 검색합니다.

<br>


###  [로그인 / 회원가입입]



| 로그인/회원가입 |
|----------|
|![로그인](https://github.com/Hun425/finalpjt/assets/147483675/61d087de-f33c-49df-9555-c6f08f82f9ef)|

- 왼쪽을 누르면 로그인, 오른쪽을 누르면 회원가입페이지가 나오게됩니다.
- 회원가입도중, 유저이름 또는 이메일이 중복되게되면 실시간으로 사용자에게 알려줍니다.
- 로그인/회원가입이 성공하거나 실패하면 알림 팝업창으로 알려줍니다.


<br>

###  [마이페이지]


| 마이페이지 |
|----------|
|![프로필페이지](https://github.com/Hun425/finalpjt/assets/147483675/aa13acce-98a8-4e6a-a245-223d7091debf)|

- 로그인된 사용자 정보를 볼 수 있습니다.
- 프로필 사진을 변경할 수 있습니다.
- 사용자가 좋아요누른 영화 목록 및 개수를 보여줍니다.
- 사용자가 좋아요 누른 리뷰 목록 및 개수를 보여줍니다.

<br>



### [챗봇]


| 챗봇 |
|----------|
|![챗봇](https://github.com/Hun425/finalpjt/assets/147483675/a391660f-013b-48ac-87c6-9726d052f9f4)|

- 사용자가 인공지능과 소통이 가능한 채팅방입니다.
- 비로그인 사용자가 메세지를 보낼시, 로그인 요청 메세지로 응답합니다.
- clear 버튼을 통해 지금까지 보낸 메세지를 초기화 할 수 있습니다.

<br>


### [영화 상세페이지]



| 영화 상세 정보 |
|----------|
|![영화상세](https://github.com/Hun425/finalpjt/assets/147483675/994b14da-447f-4683-9163-f66082c9394a)|

- 영화의 상세정보을 열람 할 수 있습니다.
- 평점을 별점으로 간략하게 확인 할 수 있습니다.
- 리뷰작성 또는 트레일러 페이지로 이동 할 수 있습니다.


<br>

### [영화 리뷰 정보]


| 리뷰 생성 & 조회 |
|----------|
|![영화 리뷰 생성 조회](https://github.com/Hun425/finalpjt/assets/147483675/6bf0e866-ca3c-4040-8f6e-8a6ff94ccefa)|



| 리뷰 수정 & 삭제 |
|----------|
|![영화 리뷰 수정 삭제](https://github.com/Hun425/finalpjt/assets/147483675/97a9cc5f-ca45-43c6-ae34-65611d595e87)|

- 영화 리뷰를 수정, 삭제 또는 생성 할 수 있습니다.
- 별 아이콘을 클릭해서 개당 2점의 평점으로 최대 10점까지 줄 수 있습니다.
- 자기 자신이 쓴 글만 메뉴 버튼을 통해 수정 및 삭제가 가능합니다.
<br>

| 댓글 생성 & 삭제|
|----------|
|![댓글 생성 삭제](https://github.com/Hun425/finalpjt/assets/147483675/b9119772-4bcc-49bf-b9f6-62f7c98b2f77)|

- 로그인한 사용자는 좋아요 버튼과 댓글 생성 버튼을 누를 수 있습니다.
- 좋아요 개수와 댓글 개수를 표시해 줍니다.
- 자기 자신이 단 댓글만 삭제가 가능합니다.
- 좋아요를 이미 누른상태에서 한 번 더 누르게 되면 좋아요를 취소합니다.

<br>






## 8. 트러블 슈팅

### 채기훈
- https://velog.io/@chae0738/SSAFY-11기-공통-프로젝트-트러블-슈팅

### 박봉균

### 노명환

### 윤성준

### 박동민 

### 김정환

<br>


## 9. 개선 목표

- 토큰 유효기간 설정
- 유저간의 유사도를 기반으로한 추천시스템

<br>

## 10. 프로젝트 후기



### 👻 채기훈
- 10일이라는 짧은 시간이였지만, 최선을 다해 후회없는 프로젝트였습니다. 처음 하는 웹 프로젝트라 오류를 고치는데 시간이 많이 걸려 아쉬웠습니다.
- 프로젝트 인원이 2명 밖에 되지 않았지만, 다양한 협업툴과 프로젝트 관리도구를 사용하며 의사소통과 일정 관리의 중요성에 대해 다시 한번 느꼈습니다.
- 기능 구현과 오류 수정에 많은 시간을 할애해서 트러블 슈팅을 더 많이 작성하지 못한 것이 아쉬웠습니다.


<br>


### 🐬 황민채
- SPA로 개발하기 위해 여러 컴포넌트로 분류하면서 생기는 비동기 처리 및 props와 emit 설정을 위해서는 컴포넌트의 구조 설계가 명확하게 되어있어야함을 느꼈습니다.
- 비동기 처리와 화면 구성을 위해 변수 설정이 많았고, CSS 구성시에 자식 노드에게 전달되는 속성들을 고려하여 좀 더 간결한 코드를 작성하지 못한 것에 아쉬움이 있습니다.
- javascript와 css를 통해 단순히 화면에 보이는 정적인 컨텐츠가 아닌 동적인 컨텐츠를 제작하기 위해서는 다양한 속성들에 대한 인지가 필요함을 느꼈습니다.
