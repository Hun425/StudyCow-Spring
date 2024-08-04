package com.studycow.dto.openai;

import com.studycow.dto.score.ResponseScoreDto;
import com.studycow.dto.score.ScoreDto;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PlannerChatRequest {
    private String model;
    private List<Message> messages;

    public PlannerChatRequest(String model, List<ScoreDto> recentScores) {

        StringBuilder content = new StringBuilder();
        content
            .append("당신은 학생들의 학습 데이터를 분석하고 개인화된 수능 학습 계획을 생성하는 AI 교육 전문가입니다. 주어진 학생의 최근 점수 데이터를 기반으로 수능 교육 과정을 기반으로 하는 효과적인 학습 계획을 수립해야 합니다. \n\n")
            .append("입력 데이터: \n");

        // 학생의 최근 점수 데이터(5개)
        for(ScoreDto score : recentScores) {
            content.append(score.toJson()).append("\n");
        }

// ResponseScoreDto
//        content
//                .append("\nResponseScoreDto 클래스의 구조는 다음과 같습니다.\n")
//                .append("``` \n")
//                .append("public class ResponseScoreDto { \n")
//                .append("    /** 과목 코드 */ \n")
//                .append("    private int subCode; \n")
//                .append("    /** 과목 이름 */ \n")
//                .append("    private String subName; \n")
//                .append("    /** 목표 점수 */ \n")
//                .append("    private int targetScore; \n")
//                .append("    /** 목표 등급 */ \n")
//                .append("    private int targetGrade; \n")
//                .append("    /** 해당 과목의 최대 점수 */ \n")
//                .append("    private int maxScore; \n")
//                .append("    /** 조언 */ \n")
//                .append("    private String advice; \n")
//                .append("    /** 점수 목록 */ \n")
//                .append("    private List<ScoreDto> scores;")
//                .append("} \n ``` \n");


        //ScoreDto
        content
                .append("ScoreDto 클래스의 구조는 다음과 같습니다.\n")
                .append("``` \n")
                .append("public class ScoreDto { \n")
                .append("    /** 성적 ID */ \n")
                .append("    private Long scoreId; \n")
                .append("    /** 과목 코드 */ \n")
                .append("    private int subCode; \n")
                .append("    /** 과목 이름 */ \n")
                .append("    private String subName; \n")
                .append("    /** 점수 */ \n")
                .append("    private int testScore; \n")
                .append("    /** 등급(1~9) */ \n")
                .append("    private Integer testGrade; \n")
                .append("    /** 시험 일자 */ \n")
                .append("    private LocalDate testDate; \n")
                .append("    /** 오답 내역 목록 */ \n")
                .append("    private List<ScoreDetailDto> scoreDetails; \n")
                .append("} \n ``` \n");

        // ScoreDetailDto
        content
                .append("ScoreDetailDto 클래스의 구조는 다음과 같습니다.\n")
                .append("``` \n")
                .append("public class ScoreDetailDto { \n")
                .append("    /** 오답 내역 ID */ \n")
                .append("    private Long wrongDetailId; \n")
                .append("    /** 점수 ID */ \n")
                .append("    private Long scoreId; \n")
                .append("    /** 오답 유형 코드 */ \n")
                .append("    private int catCode; \n")
                .append("    /** 오답 유형명 */ \n")
                .append("    private String catName; \n")
                .append("    /** 오답 문항 개수 */ \n")
                .append("    private int wrongCnt;")
                .append("} \n ``` \n");

        // 과목 코드 DB
//                .append("``` \n")


        content
                .append("문제 유형 코드의 각 칼럼의 의미와 테이블은 다음과 같습니다. 칼럼 의미 테이블을 잘 숙지하여 과목코드, 과목명, 과목 최대 점수에 착오 없기 바랍니다. \n")
                .append("sub_code : 과목 코드\n")
                .append("sub_max_score : 과목 최대 점수 \n")
                .append("sub_status : 과목 상태(1:정상) \n")
                .append("sub_in_date : 과목 생성 일시 \n")
                .append("sub_name : 과목명 \n")
                .append("# sub_code, sub_max_score, sub_status, sub_in_date, sub_name \n")
                .append("'1', '100', '1', '2024-07-22 09:47:26.000000', '국어' \n")
                .append("'2', '100', '1', '2024-07-22 09:47:26.000000', '수학' \n")
                .append("'3', '100', '1', '2024-07-22 09:47:26.000000', '영어' \n")
                .append("'4', '50', '1', '2024-07-22 09:47:26.000000', '한국사' \n")
                .append("'5', '50', '1', '2024-07-22 09:47:26.000000', '사회탐구' \n")
                .append("'6', '50', '1', '2024-07-22 09:47:26.000000', '과학탐구' \n")
                .append("'7', '50', '1', '2024-07-22 09:47:26.000000', '직업탐구' \n")
                .append("'8', '50', '1', '2024-07-22 09:47:26.000000', '제2외국어/한문' \n\n");
//                .append("CREATE TABLE `t_subject_code` ( \n")
//                .append("  `sub_code` int NOT NULL AUTO_INCREMENT, \n")
//                .append("  `sub_max_score` int NOT NULL, \n")
//                .append("  `sub_status` int NOT NULL, \n")
//                .append("  `sub_in_date` datetime(6) NOT NULL, \n")
//                .append("  `sub_name` varchar(20) DEFAULT NULL, \n")
//                .append("   PRIMARY KEY (`sub_code`), \n")
//                .append("   KEY `idx_status` (`sub_status`) \n")
//                .append(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; \n ``` \n")
//                .append("t_subject_code DB DUMP SQL은 다음과 같습니다. \n")
//                .append("```INSERT INTO `t_category` VALUES (1,1,1,'2024-07-22 10:26:01.000000','독서'),(2,1,1,'2024-07-22 10:26:01.000000','문학'),(3,1,1,'2024-07-22 10:26:01.000000','화법과 작문'),(4,1,1,'2024-07-22 10:26:01.000000','언어와 매체'),(5,1,2,'2024-07-22 10:26:01.000000','수학1'),(6,1,2,'2024-07-22 10:26:01.000000','수학2'),(7,1,2,'2024-07-22 10:26:01.000000','미적분'),(8,1,2,'2024-07-22 10:26:01.000000','기하'),(9,1,2,'2024-07-22 10:26:01.000000','확률과 통계'),(10,1,3,'2024-07-22 10:26:01.000000','듣기'),(11,1,3,'2024-07-22 10:26:01.000000','읽기'),(12,1,4,'2024-07-22 10:26:01.000000','한국사'),(13,1,5,'2024-07-22 10:26:01.000000','생활과 윤리'),(14,1,5,'2024-07-22 10:26:01.000000','윤리와 사상'),(15,1,5,'2024-07-22 10:26:01.000000','한국지리'),(16,1,5,'2024-07-22 10:26:01.000000','세계지리'),(17,1,5,'2024-07-22 10:26:01.000000','동아시아사'),(18,1,5,'2024-07-22 10:26:01.000000','세계사'),(19,1,5,'2024-07-22 10:26:01.000000','경제'),(20,1,5,'2024-07-22 10:26:01.000000','정치와 법'),(21,1,5,'2024-07-22 10:26:01.000000','사회 문화'),(22,1,6,'2024-07-22 10:26:01.000000','물리학1'),(23,1,6,'2024-07-22 10:26:01.000000','물리학2'),(24,1,6,'2024-07-22 10:26:01.000000','화학1'),(25,1,6,'2024-07-22 10:26:01.000000','화학2'),(26,1,6,'2024-07-22 10:26:01.000000','생명과학1'),(27,1,6,'2024-07-22 10:26:01.000000','생명과학2'),(28,1,6,'2024-07-22 10:26:01.000000','지구과학1'),(29,1,6,'2024-07-22 10:26:01.000000','지구과학2'),(30,1,7,'2024-07-22 10:26:01.000000','농업 기초 기술'),(31,1,7,'2024-07-22 10:26:01.000000','공업 일반'),(32,1,7,'2024-07-22 10:26:01.000000','상업 경제'),(33,1,7,'2024-07-22 10:26:01.000000','수산 해운 산업 기초'),(34,1,7,'2024-07-22 10:26:01.000000','인간 발달'),(35,1,7,'2024-07-22 10:26:01.000000','성공적인 직업생활'),(36,1,8,'2024-07-22 10:26:01.000000','독일어1'),(37,1,8,'2024-07-22 10:26:01.000000','프랑스어1'),(38,1,8,'2024-07-22 10:26:01.000000','스페인어1'),(39,1,8,'2024-07-22 10:26:01.000000','중국어1'),(40,1,8,'2024-07-22 10:26:01.000000','일본어1'),(41,1,8,'2024-07-22 10:26:01.000000','러시아어1'),(42,1,8,'2024-07-22 10:26:01.000000','아랍어1'),(43,1,8,'2024-07-22 10:26:01.000000','베트남어1'),(44,1,8,'2024-07-22 10:26:01.000000','한문1');``` \n\n");


        //문제 유형 DB
        content
                .append("문제 유형 코드의 각 칼럼의 의미와 테이블은 다음과 같습니다. 칼럼 의미, 테이블을 잘 숙지하여 문제유형코드, 과목코드, 과목명, 문제유형명에 착오 없기 바랍니다. \n")
                .append("cat_code : 문제 유형 코드 \n")
                .append("cat_status : 유형 상태(1:정상) \n")
                .append("sub_code: 과목 코드 \n")
                .append("cat_in_date: 유형 추가 일시 \n")
                .append("cat_name: 문제유형명 \n")
                .append("# cat_code, cat_status, sub_code, cat_in_date, cat_name \n")
                .append("'1', '1', '1', '2024-07-22 10:26:01.000000', '독서' \n")
                .append("'2', '1', '1', '2024-07-22 10:26:01.000000', '문학' \n")
                .append("'3', '1', '1', '2024-07-22 10:26:01.000000', '화법과 작문' \n")
                .append("'4', '1', '1', '2024-07-22 10:26:01.000000', '언어와 매체' \n")
                .append("'5', '1', '2', '2024-07-22 10:26:01.000000', '수학1' \n")
                .append("'6', '1', '2', '2024-07-22 10:26:01.000000', '수학2' \n")
                .append("'7', '1', '2', '2024-07-22 10:26:01.000000', '미적분' \n")
                .append("'8', '1', '2', '2024-07-22 10:26:01.000000', '기하' \n")
                .append("'9', '1', '2', '2024-07-22 10:26:01.000000', '확률과 통계' \n")
                .append("'10', '1', '3', '2024-07-22 10:26:01.000000', '듣기' \n")
                .append("'11', '1', '3', '2024-07-22 10:26:01.000000', '읽기' \n")
                .append("'12', '1', '4', '2024-07-22 10:26:01.000000', '한국사' \n")
                .append("'13', '1', '5', '2024-07-22 10:26:01.000000', '생활과 윤리' \n")
                .append("'14', '1', '5', '2024-07-22 10:26:01.000000', '윤리와 사상' \n")
                .append("'15', '1', '5', '2024-07-22 10:26:01.000000', '한국지리' \n")
                .append("'16', '1', '5', '2024-07-22 10:26:01.000000', '세계지리' \n")
                .append("'17', '1', '5', '2024-07-22 10:26:01.000000', '동아시아사' \n")
                .append("'18', '1', '5', '2024-07-22 10:26:01.000000', '세계사' \n")
                .append("'19', '1', '5', '2024-07-22 10:26:01.000000', '경제' \n")
                .append("'20', '1', '5', '2024-07-22 10:26:01.000000', '정치와 법' \n")
                .append("'21', '1', '5', '2024-07-22 10:26:01.000000', '사회 문화' \n")
                .append("'22', '1', '6', '2024-07-22 10:26:01.000000', '물리학1' \n")
                .append("'23', '1', '6', '2024-07-22 10:26:01.000000', '물리학2' \n")
                .append("'24', '1', '6', '2024-07-22 10:26:01.000000', '화학1' \n")
                .append("'25', '1', '6', '2024-07-22 10:26:01.000000', '화학2' \n")
                .append("'26', '1', '6', '2024-07-22 10:26:01.000000', '생명과학1' \n")
                .append("'27', '1', '6', '2024-07-22 10:26:01.000000', '생명과학2' \n")
                .append("'28', '1', '6', '2024-07-22 10:26:01.000000', '지구과학1' \n")
                .append("'29', '1', '6', '2024-07-22 10:26:01.000000', '지구과학2' \n")
                .append("'30', '1', '7', '2024-07-22 10:26:01.000000', '농업 기초 기술' \n")
                .append("'31', '1', '7', '2024-07-22 10:26:01.000000', '공업 일반' \n")
                .append("'32', '1', '7', '2024-07-22 10:26:01.000000', '상업 경제' \n")
                .append("'33', '1', '7', '2024-07-22 10:26:01.000000', '수산 해운 산업 기초' \n")
                .append("'34', '1', '7', '2024-07-22 10:26:01.000000', '인간 발달' \n")
                .append("'35', '1', '7', '2024-07-22 10:26:01.000000', '성공적인 직업생활' \n")
                .append("'36', '1', '8', '2024-07-22 10:26:01.000000', '독일어1' \n")
                .append("'37', '1', '8', '2024-07-22 10:26:01.000000', '프랑스어1' \n")
                .append("'38', '1', '8', '2024-07-22 10:26:01.000000', '스페인어1' \n")
                .append("'39', '1', '8', '2024-07-22 10:26:01.000000', '중국어1' \n")
                .append("'40', '1', '8', '2024-07-22 10:26:01.000000', '일본어1' \n")
                .append("'41', '1', '8', '2024-07-22 10:26:01.000000', '러시아어1' \n")
                .append("'42', '1', '8', '2024-07-22 10:26:01.000000', '아랍어1' \n")
                .append("'43', '1', '8', '2024-07-22 10:26:01.000000', '베트남어1' \n")
                .append("'44', '1', '8', '2024-07-22 10:26:01.000000', '한문1' \n\n");
//                .append("``` \n")
//                .append("CREATE TABLE `t_category` ( \n")
//                .append("  `cat_code` int NOT NULL AUTO_INCREMENT, \n")
//                .append("  `cat_status` int NOT NULL, \n")
//                .append("  `sub_code` int NOT NULL, \n")
//                .append("  `cat_in_date` datetime(6) NOT NULL, \n")
//                .append("  `cat_name` varchar(30) DEFAULT NULL, \n")
//                .append("  PRIMARY KEY (`cat_code`), \n")
//                .append("  KEY `idx_status` (`cat_status`), \n")
//                .append("  KEY `FKdotp8fhys3qxe6iamjt1481x` (`sub_code`), \n")
//                .append("  CONSTRAINT `FKdotp8fhys3qxe6iamjt1481x` FOREIGN KEY (`sub_code`) REFERENCES `t_subject_code` (`sub_code`) \n")
//                .append(") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; \n ``` \n")
//                .append("t_category DB DUMP SQL은 다음과 같습니다. \n")
//                .append("```INSERT INTO `t_subject_code` VALUES (1,100,1,'2024-07-22 09:47:26.000000','국어'),(2,100,1,'2024-07-22 09:47:26.000000','수학'),(3,100,1,'2024-07-22 09:47:26.000000','영어'),(4,50,1,'2024-07-22 09:47:26.000000','한국사'),(5,50,1,'2024-07-22 09:47:26.000000','사회탐구'),(6,50,1,'2024-07-22 09:47:26.000000','과학탐구'),(7,50,1,'2024-07-22 09:47:26.000000','직업탐구'),(8,50,1,'2024-07-22 09:47:26.000000','제2외국어/한문');``` \n\n");


        //PlannerCreateDto
        content
                .append("PlannerCreateDto 클래스의 구조는 다음과 같습니다.\n")
                .append("``` \n")
                .append("public class PlannerCreateDto { \n")
                .append("    /** 과목 코드 */ \n")
                .append("    private int subCode; \n")
                .append("    /** 플랜 날짜 */ \n")
                .append("    private LocalDate planDate; \n")
                .append("    /** 내용 */ \n")
                .append("    private String planContent; \n")
                .append("    /** 계획 학습 시간 */ \n")
                .append("    private int planStudyTime; \n")
                .append("    /** 상태 */ \n")
                .append("    private int planStatus; \n")
                .append("} \n ``` \n");

        content.append("\n")
                .append("이 데이터를 분석하여 다음 작업을 수행하세요: \n")
                .append("1. 각 과목의 현재 성적과 목표 점수/등급 간의 차이를 파악하세요. \n")
                .append("2. 가장 개선이 필요한 과목을 식별하세요. \n")
                .append("3. 각 과목에 대한 맞춤형 학습 전략을 개발하세요. \n")
                .append("4. 우선순위를 정하고 시간 관리 제안을 포함한 종합적인 학습 계획을 수립하세요. \n\n")
                .append("그리고 이 분석을 바탕으로 다음 7일간의 일일 학습 계획을 PlannerCreateDto 형식의 JSON 배열로 생성해주세요. 각 계획은 다음 필드를 포함해야 합니다: \n")
                .append("- subCode: 과목 코드 (정수) \n")
                .append("- planDate: 계획 날짜 (YYYY-MM-DD 형식의 문자열) \n")
                .append("- planContent: 구체적인 학습 내용 (문자열) \n")
                .append("- planStudyTime: 계획된 학습 시간 (분 단위, 정수) \n")
                .append("- planStatus: 계획 상태 (0: 예정, 1: 완료, 2: 실패로 가정) \n\n")
                .append("주의사항: \n")
                .append("- 학생의 현재 성적과 목표를 고려하여 현실적이고 달성 가능한 계획을 제시하세요. \n")
                .append("- 각 과목에 대해 균형 잡힌 시간 배분을 하되, 개선이 더 필요한 과목에 약간 더 집중하세요. \n")
                .append("- 학습 내용은 구체적이고 실행 가능해야 합니다. \n")
                .append("- 과목별 세부 유형에 대한 계획을 제공해야 합니다. \n")
                .append("- 계획은 다양한 학습 방법(예: 복습, 문제 풀이, 요약 정리 등)을 포함해야 합니다. \n\n")
                .append("출력 형식: \n")
                .append("{ \n")
                .append("  \"analysis\": \"데이터 분석 및 전략 설명 (문자열)\", \n")
                .append("  \"plans\": [PlannerCreateDto 객체들의 배열] \n")
                .append("} \n")
                .append(" \n")
                .append("이 형식에 맞춰 분석 결과와 7일간의 학습 계획을 JSON 형태로 제공해주세요.");

        System.out.println(content.toString());

        this.model = model;
        this.messages =  new ArrayList<>();
        this.messages.add(new Message("user", content.toString()));
    }
}
