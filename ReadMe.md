# 📖 공부 했소?



![로고](/uploads/c0fa4601709654bb839364216d4e834f/로고.png)

## 프로젝트 기획 배경

- 코로나19 팬데믹으로 인해 온라인 학습이 일상화 되었지만
이러한 온라인 학습에는 여러가지 문제점이 있습니다.

- **자기주도적 학습의 어려움**
    - 온라인 환경에서 혼자 공부하는 학생들은 자기통제와 시간관리에 많은 어려움을 겪고있습니다. 

- **학습 동기부여의 부재**
    - 혼자 공부하는 환경의 서비스들은 지속적인 동기부여가 부족해 학습 의욕을 유지하기 어렵습니다.

- 이러한 **문제인식**으로 출발해, Studycow를 기획하게 되었습니다.

#### 이전 시도 및 개선점

- **통합화된 서비스의 부재**
    - 과거에도 다양한 온라인 스터디 서비스가 있었지만, 하나로 통합 관리하는 서비스는 찾기 어려웠습니다.

- **공부 효율성 유지**
    - 집에서 혼자 공부를 하더라도, 그룹 스터디 서비스로 밖에서 공부하는 것과 같은 효과를 얻을 수 있습니다. 

- **게이미피케이션**
    - 사용자의 동기부여를 위한 주요 기능들과 게이미피케이션 서비스를 결합했습니다.

- **AI 기반 맞춤형 학습 지원**
    - 개인화된 학습 플래너: 사용자의 성적 및 오답 유형을 분석하여 AI가 최적화된 학습 계획을 자동으로 생성합니다.
    - AI 조언 시스템: 최근 성적 추이를 기반으로 개인별 맞춤 학습 조언을 제공합니다.
    - AI 손 인식 기반 집중도 관리: 그룹 화상 스터디에서 AI가 사용자의 손 동작을 감지하여 자동으로 집중 시간을 측정합니다.


- **Studycow**는 여러 서비스를 찾아다닐 필요 없이, 하나의 서비스 안에서 **통합된 기능**들을 제공합니다.

<br>

## 프로젝트 소개

- **성적 관리** 및 **동기 부여**가 필요한 학생을 위한 통합 서비스
- 온라인 그룹 스터디를 위한 캠 스터디 및 손 감지 타이머 기능
- 자율 학습 관리를 위한 플래너 및 성적 기반 자동 생성 기능
- 학생 동기부여를 위한 성적관리 및 게이미피케이션 & 랭킹 기능
- **개인 맞춤형 학습 플랜 추천** 기능

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
- 스터디 플래너: 개인 및 그룹 학습 계획 수립, **성적 기반 AI학습 전략 추천**
- 성적 관리: 성적 입력, 분석 및 조언 
- 타임 트래킹:  **AI 손 인식 기반 공부 시간** 측정 및 랭킹 시스템
- 사용자 관리: 회원가입, 로그인, 프로필 관리
- 커뮤니티 기능: 친구 추가, 친구 대시보드 확인


<br>

## 2. 채택한 개발 기술과 브랜치 전략


### Spring

- 향후 서비스 확장시 유연하게 대처하기 위한 Java 기반 Spring Framework 


### JDK17

- record 기능을 사용한 Dto 및 instancof 패턴 매칭을 위한 JDK17버전 

### React

- Vue.js 보다 자유로운 편집 및 커스텀을 위한 React 


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
- **역할**
    - 역할배분 및 일정관리 / 백엔드,인프라 담당
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
|![비로그인화면3](/uploads/c7cb97d7b748c0be681dcd3890234527/비로그인화면3.gif)|

- 공부했소?의 서비스를 간단히 소개합니다.
- Start를 누르면 회원가입으로 바로 이동합니다.


| 메인페이지/로그인 |
|----------|
|![로그인화면2](/uploads/a0239fad66ea0a71907345ab5a3bc876/로그인화면2.gif)|

- 사용자의 프로필 및 활동 내역을 요약해서 보여줍니다.
- 과목별 성적 현황 / 최근 입장한 그룹 스터디방 / 오늘의 할일 / 플래너 잔디 현황 
- 잔디의 색깔은 일일 플래너의 개수 0/2/4/5~ 별로 달라집니다.
- 오늘의 할일은 현재 날짜 기준 등록된 플래너의 요약을 보여줍니다.

<br>


### [네비게이션 바]



| 네비게이션 바 |
|----------|
|![네비게이션바2](/uploads/d48a0fe421938a8011a8e6ef4bb18ae5/네비게이션바2.gif)|

- 각각의 기능을 담당하는 페이지로 이동시켜줍니다.

<br>

###  [로그인/회원가입 페이지]

| 로그인/회원가입 |
|----------|
|![로그인회원가입](/uploads/244f49a466b4eab5e8ef5e12714e62b1/로그인회원가입.gif)|

- 사용자의 정보를 받고 로그인을 성공하면 메인페이지로 리다이렉트합니다.
- 닉네임, 이메일, 비밀번호를 입력하면 회원가입을 시켜줍니다.
- 이메일은 중복 불가능합니다.
- 닉네임은 2~20자 사이의 단어만 가능합니다.

<br>

###  [캠스터디]


| 목록리스트 |
|----------|
|![캠스터디페이지](/uploads/c293c9140e4a4a8166c2d8266f3712c0/캠스터디페이지.gif)|

- 캠스터디의 전체 방 목록을 보여줍니다.
- 자신이 최근에 들어간 방을 보여줍니다.
- 입장하기 버튼을 누르면 방의 상세 정보를 보여줍니다.
- 공부의 전체 랭킹시간을 보여주고, 매일 06시에 일일 랭킹 기준으로 경험치 정산 후 초기화됩니다.

<br>

| 방 상세 정보 |
|----------|
|![방목록_페이지](/uploads/41e366e615a7a20f411587636bf33a75/방목록_페이지.gif)|

- 방의 상세 정보를 표시하고, 카메라와 마이크를 테스트합니다.
- 방의 설명을 확인하고, 방장이 정한 규칙들을 미리 확인 할 수 있습니다.
- 입장버튼을 누르게 되면, 해당 방으로 입장합니다.

<br>


### 캠스터디 내부페이지

<br>

| 손 감지 & 타이밍 기능 |
|----------|
|![캠스터디_손_감지_기능](/uploads/7a537dbca09b8d09958b0b9d4fd5b5f1/캠스터디_손_감지_기능.gif)|
- 현재 입장해 있는 유저들의 캠을 확인 할 수 있습니다.
- 캠에 손이 검출된다면, 자동으로 타이머가 시작되고 1분단위로 랭킹이 기록됩니다.

<br>

| 실시간 채팅 & 랭킹 플래너 |
|----------|
|![캠스터디_채팅_랭킹_플래너](/uploads/a07811d658d885ca883810f15c8b9b47/캠스터디_채팅_랭킹_플래너.gif)|
- 채팅방 아이콘을 통해 채팅에 참가한 유저들과 실시간 채팅을 할 수 있습니다.
- 채팅방에 입장 및 퇴장시, 다른 사람들에게 알림 채팅이 나오게 됩니다.

<br>

| 마이크 & 스피커 설정 |
|----------|
|![캠스터디_설정_BGM](/uploads/e227c9aa71bab895cf1977050fe1d475/캠스터디_설정_BGM.gif)|
- 설정 버튼을 클릭시, 마이크와 스피커를 조절 할 수 있습니다.
- 마이크,스피커,캠 아이콘 클릭으로 ON,OFF를 설정 할 수 있습니다.
- 랭킹,채팅창,플래너 아이콘 클릭으로 화면에 띄울 수 있습니다.

<br>


###  [플래너]


|플래너 메인페이지|
|----------|
|![플래너_메인페이지](/uploads/9636e6d75029caa523aac9998e9fa188/플래너_메인페이지.gif)|

- 달력을 클릭하면 해당 날짜의 플래너를 작성 & 조회 할 수 있습니다.
- 플래너를 과목별로 정렬해서 확인 할 수 있습니다.

<br>

|플래너 생성 & 수정 & 삭제|
|----------|
|![플래너_생성_수정_삭제](/uploads/0553eb0502250d927bab1011f21645ad/플래너_생성_수정_삭제.gif)|

- 플래너의 과목을 정하고 세부사항과 시간을 기입하면 등록 할 수 있습니다.
- 플래너를 수정 및 삭제 할 수 있습니다.

<br>

|플래너 자동화|
|----------|
|![플래너_자동화](/uploads/179c7eb72d2141020035b00fff9f4ee3/플래너_자동화.gif)|

- 사용자가 등록한 성적과 학습시간 기반으로 플래너를 자동 생성 해줍니다.
- 해당 플랜을 추천해준 이유를 확인 할 수 있고, 세부 사항은 사용자가 직접 수정 후 등록 할 수 있습니다.


<br>

###  [성적 관리]


|메인 페이지|
|----------|
|![성적관리_메인페이지](/uploads/0a88cccaf7bd249217c4edb684dbb8a0/성적관리_메인페이지.gif)|

- 사용자 캐릭터의 등급과 성적 현황을 보여줍니다.
- 최근 성적의 변화와 자신의 취약점을 그래프로 확인 할 수 있습니다.
- 공개 비공개 여부를 설정 할 수 있습니다.

<br>


|조언|
|----------|
|![성적 조언.gif](/uploads/a9eeb003c63ce9503b1620074bdcd8ed/%EC%84%B1%EC%A0%81_%EC%A1%B0%EC%96%B8.gif)|

- 사용자의 최근 성적과 유형형에 기반한 조언을 해줍니다.

<br>

###  [마이페이지]

| 회원정보 수정 |
|----------|
|![회원_정보_수정](/uploads/124b9d132821a7df0418c6c00817b81c/회원_정보_수정.gif)|

- 회원의 개인 정보(이메일, 닉네임, 썸네일 사진)를 수정 할 수 있습니다.
- 회원 정보 변경 후 재 로그인 하도록 메인 페이지로 이동합니다.

<br>



| 친구 페이지 |
|----------|
|![친구_관리](/uploads/4e684baf328d955c9d6b950336bfc45a/친구_관리.gif)|

- 친구 요청을 원하는 사람의 이름을 검색 할 수 있습니다.
- 검색시에 글자를 포함하는 모든 사람의 이름을 반환합니다.
- 친구 요청 및 거절을 할 수 있습니다.
- 친구 요청이 수락 된 이후에 친구의 성적 관리 대시보드의 공개 여부에 따라 볼 수 있습니다.


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



<br>

## 10. 프로젝트 후기



### 👻 채기훈



<br>


### 🐬

