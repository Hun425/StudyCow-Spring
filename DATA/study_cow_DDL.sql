DROP DATABASE IF EXISTS `study_cow`;
CREATE DATABASE  IF NOT EXISTS `study_cow` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `study_cow`;

-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: study_cow
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+09:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_attend`
--

DROP TABLE IF EXISTS `t_attend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_attend` (
  `user_id` int NOT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `FKdvmqmitwvj0l7q5rub1tleqb8` (`room_id`),
  CONSTRAINT `FKdvmqmitwvj0l7q5rub1tleqb8` FOREIGN KEY (`room_id`) REFERENCES `t_room` (`room_id`),
  CONSTRAINT `FKi6w6u3kg3surqvh7pykr3y7of` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_bgm`
--

DROP TABLE IF EXISTS `t_bgm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_bgm` (
  `bgm_index` int NOT NULL AUTO_INCREMENT,
  `bgm_in_date` datetime(6) NOT NULL,
  `room_id` bigint NOT NULL,
  `bgm_link` varchar(500) NOT NULL,
  `bgm_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`bgm_index`,`room_id`),
  KEY `FK8gln7639js4bo6pvpfbt6d7jp` (`room_id`),
  CONSTRAINT `FK8gln7639js4bo6pvpfbt6d7jp` FOREIGN KEY (`room_id`) REFERENCES `t_room` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_category`
--

DROP TABLE IF EXISTS `t_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_category` (
  `cat_code` int NOT NULL AUTO_INCREMENT,
  `cat_status` int NOT NULL,
  `sub_code` int NOT NULL,
  `cat_in_date` datetime(6) NOT NULL,
  `cat_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`cat_code`),
  KEY `idx_status` (`cat_status`),
  KEY `FKdotp8fhys3qxe6iamjt1481x` (`sub_code`),
  CONSTRAINT `FKdotp8fhys3qxe6iamjt1481x` FOREIGN KEY (`sub_code`) REFERENCES `t_subject_code` (`sub_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_chat_log`
--

DROP TABLE IF EXISTS `t_chat_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_chat_log` (
  `user_id` int NOT NULL,
  `chat_id` bigint NOT NULL AUTO_INCREMENT,
  `chat_in_date` datetime(6) NOT NULL,
  `room_id` bigint NOT NULL,
  `chat_content` varchar(1000) NOT NULL,
  PRIMARY KEY (`chat_id`),
  KEY `FKnuecydnkp3ws9w7x9b3xl9jox` (`room_id`),
  KEY `FKbkjxfguh5yvj62whkkppen47q` (`user_id`),
  CONSTRAINT `FKbkjxfguh5yvj62whkkppen47q` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`),
  CONSTRAINT `FKnuecydnkp3ws9w7x9b3xl9jox` FOREIGN KEY (`room_id`) REFERENCES `t_room` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_exp_log`
--

DROP TABLE IF EXISTS `t_exp_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_exp_log` (
  `get_amount` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `exp_id` bigint NOT NULL AUTO_INCREMENT,
  `get_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`exp_id`),
  KEY `idx_getDate` (`get_date`),
  KEY `FKfpem46mrnul19qdelkjlho4fm` (`user_id`),
  CONSTRAINT `FKfpem46mrnul19qdelkjlho4fm` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_friend`
--

DROP TABLE IF EXISTS `t_friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_friend` (
  `user_id1` int NOT NULL,
  `user_id2` int NOT NULL,
  `friend_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`user_id1`,`user_id2`),
  KEY `FKarpmjyvd2ti6xi9ludqfp9t6a` (`user_id2`),
  CONSTRAINT `FK4pce7d12ox5nc2f8aeutsdlu5` FOREIGN KEY (`user_id1`) REFERENCES `t_user` (`user_id`),
  CONSTRAINT `FKarpmjyvd2ti6xi9ludqfp9t6a` FOREIGN KEY (`user_id2`) REFERENCES `t_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_friend_request`
--

DROP TABLE IF EXISTS `t_friend_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_friend_request` (
  `friend_request_id` int NOT NULL AUTO_INCREMENT,
  `from_user_id` int NOT NULL,
  `request_status` int NOT NULL DEFAULT '0',
  `to_user_id` int NOT NULL,
  `request_date` datetime(6) NOT NULL,
  `request_update_date` datetime(6) NOT NULL,
  PRIMARY KEY (`friend_request_id`),
  KEY `FKdpph0kr0sjk457pw6nby5raoq` (`from_user_id`),
  KEY `FKovrd0q5t17mwlwdwuoyfcnvc9` (`to_user_id`),
  CONSTRAINT `FKdpph0kr0sjk457pw6nby5raoq` FOREIGN KEY (`from_user_id`) REFERENCES `t_user` (`user_id`),
  CONSTRAINT `FKovrd0q5t17mwlwdwuoyfcnvc9` FOREIGN KEY (`to_user_id`) REFERENCES `t_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_grade_code`
--

DROP TABLE IF EXISTS `t_grade_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_grade_code` (
  `grade_code` int NOT NULL DEFAULT '1',
  `max_exp` int NOT NULL DEFAULT '100',
  `min_exp` int NOT NULL DEFAULT '0',
  `grade_name` varchar(10) NOT NULL,
  PRIMARY KEY (`grade_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_in_log`
--

DROP TABLE IF EXISTS `t_in_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_in_log` (
  `study_date` date NOT NULL,
  `study_time` int NOT NULL,
  `user_id` int NOT NULL,
  `in_date` datetime(6) NOT NULL,
  `in_log_id` bigint NOT NULL AUTO_INCREMENT,
  `out_date` datetime(6) DEFAULT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`in_log_id`),
  KEY `FKb44goly7q7efmkpwqo8xqhiqd` (`room_id`),
  KEY `FK4hnwqesmed40ujoftlhsc8tja` (`user_id`),
  CONSTRAINT `FK4hnwqesmed40ujoftlhsc8tja` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`),
  CONSTRAINT `FKb44goly7q7efmkpwqo8xqhiqd` FOREIGN KEY (`room_id`) REFERENCES `t_room` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_plan`
--

DROP TABLE IF EXISTS `t_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_plan` (
  `plan_date` date NOT NULL,
  `plan_status` int NOT NULL DEFAULT '0',
  `plan_study_time` int NOT NULL DEFAULT '0',
  `plan_sum_time` int NOT NULL DEFAULT '0',
  `sub_code` int NOT NULL,
  `user_id` int NOT NULL,
  `plan_id` bigint NOT NULL AUTO_INCREMENT,
  `plan_in_date` datetime(6) NOT NULL,
  `plan_update_date` datetime(6) NOT NULL,
  `plan_content` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`plan_id`),
  KEY `idx_planDate` (`plan_date`),
  KEY `FKly6cxgephbqrtsm49421omgtl` (`sub_code`),
  KEY `FKbkaspc2romlt2tbsb1lfpougt` (`user_id`),
  CONSTRAINT `FKbkaspc2romlt2tbsb1lfpougt` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`),
  CONSTRAINT `FKly6cxgephbqrtsm49421omgtl` FOREIGN KEY (`sub_code`) REFERENCES `t_subject_code` (`sub_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_proc_room_study`
--

DROP TABLE IF EXISTS `t_proc_room_study`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_proc_room_study` (
  `proc_date` date NOT NULL,
  `sum_room_time` int NOT NULL,
  `proc_room_id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`proc_room_id`),
  UNIQUE KEY `uni_room_date` (`room_id`,`proc_date`),
  CONSTRAINT `FKnorwjxqby9nbvuk6hdrrqjc9s` FOREIGN KEY (`room_id`) REFERENCES `t_room` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_proc_user_study`
--

DROP TABLE IF EXISTS `t_proc_user_study`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_proc_user_study` (
  `proc_date` date NOT NULL,
  `sum_study_time` int NOT NULL,
  `user_id` int NOT NULL,
  `proc_user_id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`proc_user_id`),
  UNIQUE KEY `UNI_USER_DATE` (`user_id`,`proc_date`),
  CONSTRAINT `FK3jsitjstd7io43s32c8hcdfvv` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_room`
--

DROP TABLE IF EXISTS `t_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_room` (
  `room_create_date` date NOT NULL,
  `room_end_date` date NOT NULL,
  `room_max_person` int NOT NULL,
  `room_now_person` int NOT NULL DEFAULT '0',
  `room_status` int NOT NULL,
  `user_id` int NOT NULL,
  `room_id` bigint NOT NULL AUTO_INCREMENT,
  `room_update_date` datetime(6) NOT NULL,
  `room_title` varchar(50) NOT NULL,
  `room_thumb` varchar(100) DEFAULT NULL,
  `room_content` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  KEY `idx_title_status` (`room_title`,`room_status`),
  KEY `FKmap95jb72idtowggsds8xk86e` (`user_id`),
  CONSTRAINT `FKmap95jb72idtowggsds8xk86e` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_score`
--

DROP TABLE IF EXISTS `t_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_score` (
  `sub_code` int NOT NULL,
  `test_date` date NOT NULL,
  `test_grade` int DEFAULT NULL,
  `test_score` int NOT NULL,
  `user_id` int NOT NULL,
  `score_id` bigint NOT NULL AUTO_INCREMENT,
  `score_update_date` datetime(6) NOT NULL,
  PRIMARY KEY (`score_id`),
  UNIQUE KEY `uni_user_sub_date` (`user_id`,`sub_code`,`test_date`),
  KEY `idx_testDate` (`test_date`),
  KEY `FKj4evgn8pqk1ihsgekdn01vhe0` (`sub_code`),
  KEY `FKa7ixqwd04f1a6p7mmxuhrx6ms` (`user_id`),
  CONSTRAINT `FKa7ixqwd04f1a6p7mmxuhrx6ms` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`),
  CONSTRAINT `FKj4evgn8pqk1ihsgekdn01vhe0` FOREIGN KEY (`sub_code`) REFERENCES `t_subject_code` (`sub_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_subject_code`
--

DROP TABLE IF EXISTS `t_subject_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_subject_code` (
  `sub_code` int NOT NULL AUTO_INCREMENT,
  `sub_max_score` int NOT NULL,
  `sub_status` int NOT NULL,
  `sub_in_date` datetime(6) NOT NULL,
  `sub_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`sub_code`),
  KEY `idx_status` (`sub_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_user`
--

DROP TABLE IF EXISTS `t_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_user` (
  `grade_code` int NOT NULL,
  `user_exp` int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_public` int NOT NULL,
  `user_join_date` datetime(6) NOT NULL,
  `user_update_date` datetime(6) NOT NULL,
  `user_nickname` varchar(20) DEFAULT NULL,
  `user_email` varchar(30) NOT NULL,
  `user_thumb` varchar(100) DEFAULT NULL,
  `user_password` varchar(200) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKbv4irau025kecgcf0p6qbng4n` (`user_email`),
  UNIQUE KEY `UKoxopqu9jvjwayq4v57mw3aan8` (`user_nickname`),
  KEY `idx_userNickname` (`user_nickname`),
  KEY `FK8hpqah9e8uupch45mynjitsed` (`grade_code`),
  CONSTRAINT `FK8hpqah9e8uupch45mynjitsed` FOREIGN KEY (`grade_code`) REFERENCES `t_grade_code` (`grade_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_user_target`
--

DROP TABLE IF EXISTS `t_user_target`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_user_target` (
  `sub_code` int NOT NULL,
  `target_grade` int NOT NULL,
  `target_score` int NOT NULL,
  `user_id` int NOT NULL,
  `target_id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`target_id`),
  UNIQUE KEY `uni_user_sub_code` (`user_id`,`sub_code`),
  KEY `FK2ghg3nsdh8s63y420xyxv0sbh` (`sub_code`),
  CONSTRAINT `FK2ghg3nsdh8s63y420xyxv0sbh` FOREIGN KEY (`sub_code`) REFERENCES `t_subject_code` (`sub_code`),
  CONSTRAINT `FKeu8td0xehvqrad9w0mbqwd4qo` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_user_token`
--

DROP TABLE IF EXISTS `t_user_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_user_token` (
  `user_id` int NOT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `in_date` datetime(6) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FKfpotoyeydar0t93nmeudsfgsw` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `t_wrong_detail`
--

DROP TABLE IF EXISTS `t_wrong_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_wrong_detail` (
  `cat_code` int NOT NULL,
  `wrong_cnt` int NOT NULL,
  `score_id` bigint NOT NULL,
  `wrong_detail_id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`wrong_detail_id`),
  KEY `FKfqv5ucwya5828n94e7e8wl2q` (`cat_code`),
  KEY `FKbhklvy6g759188chk1d3of8lo` (`score_id`),
  CONSTRAINT `FKbhklvy6g759188chk1d3of8lo` FOREIGN KEY (`score_id`) REFERENCES `t_score` (`score_id`),
  CONSTRAINT `FKfqv5ucwya5828n94e7e8wl2q` FOREIGN KEY (`cat_code`) REFERENCES `t_category` (`cat_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



--
-- Dumping data for table `t_grade_code`
--

LOCK TABLES `t_grade_code` WRITE;
/*!40000 ALTER TABLE `t_grade_code` DISABLE KEYS */;

INSERT INTO `t_grade_code` 
VALUES 
    (1, 1000, 0, '브론즈'),
    (2, 5000, 1001, '실버'),
    (3, 10000, 5001, '골드'),
    (4, 30000, 10001, '플래티넘'),
    (5, 999999999, 30001, '다이아')
;

/*!40000 ALTER TABLE `t_grade_code` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `t_subject_code`
--

LOCK TABLES `t_subject_code` WRITE;
/*!40000 ALTER TABLE `t_subject_code` DISABLE KEYS */;

INSERT INTO `t_subject_code`(`sub_code`, `sub_max_score`, `sub_status`, `sub_in_date`, `sub_name`)
VALUES 
    (1, 100, 1, NOW(), '국어'),
    (2, 100, 1, NOW(), '수학'),
    (3, 100, 1, NOW(), '영어'),
    (4, 50, 1, NOW(), '한국사'),
    (5, 50, 1, NOW(), '생활과 윤리'),
    (6, 50, 1, NOW(), '윤리와 사상'),
    (7, 50, 1, NOW(), '한국지리'),
    (8, 50, 1, NOW(), '세계지리'),
    (9, 50, 1, NOW(), '동아시아사'),
    (10, 50, 1, NOW(), '세계사'),
    (11, 50, 1, NOW(), '경제'),
    (12, 50, 1, NOW(), '정치와 법'),
    (13, 50, 1, NOW(), '사회 문화'),
    (14, 50, 1, NOW(), '물리학1'),
    (15, 50, 1, NOW(), '물리학2'),
    (16, 50, 1, NOW(), '화학1'),
    (17, 50, 1, NOW(), '화학2'),
    (18, 50, 1, NOW(), '생명과학1'),
    (19, 50, 1, NOW(), '생명과학2'),
    (20, 50, 1, NOW(), '지구과학1'),
    (21, 50, 1, NOW(), '지구과학2')
;

/*!40000 ALTER TABLE `t_subject_code` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `t_category`
--

LOCK TABLES `t_category` WRITE;
/*!40000 ALTER TABLE `t_category` DISABLE KEYS */;

INSERT INTO `t_category`(`cat_code`, `cat_status`, `sub_code`, `cat_in_date`, `cat_name`)
VALUES 
    -- 국어(1)
    (1, 1, 1, NOW(), '문학 - 고전시가'),
    (2, 1, 1, NOW(), '문학 - 현대시'),
    (3, 1, 1, NOW(), '문학 - 고전산문'),
    (5, 1, 1, NOW(), '문학 - 현대소설'),
    (4, 1, 1, NOW(), '문학 - 극/수필'),
    (6, 1, 1, NOW(), '문학 - 갈래복합'),
    (7, 1, 1, NOW(), '독서 - 인문,예술'),
    (8, 1, 1, NOW(), '독서 - 사회,문화'),
    (9, 1, 1, NOW(), '독서 - 과학,기술'),
    (10, 1, 1, NOW(), '독서 - 주제통합'),
    (11, 1, 1, NOW(), '언어와 매체 - 언어'),
    (12, 1, 1, NOW(), '언어와 매체 - 매체'),
    (13, 1, 1, NOW(), '언어와 매체 - 통합'),
    (14, 1, 1, NOW(), '화법과 작문 - 화법'),
    (15, 1, 1, NOW(), '화법과 작문 - 작문'),
    (16, 1, 1, NOW(), '화법과 작문 - 통합'),

    -- 수학(2)
    (17, 1, 2, NOW(), '수학1 - 지수와 로그'),
    (18, 1, 2, NOW(), '수학1 - 지수함수와 로그함수'),
    (19, 1, 2, NOW(), '수학1 - 삼각함수'),
    (20, 1, 2, NOW(), '수학1 - 사인법칙과 코사인법칙'),
    (21, 1, 2, NOW(), '수학1 - 등차수열과 등비수열'),
    (22, 1, 2, NOW(), '수학1 - 수열의 합과 수학적 귀납법'),
    (23, 1, 2, NOW(), '수학2 - 함수의 극한'),
    (24, 1, 2, NOW(), '수학2 - 함수의 연속'),
    (25, 1, 2, NOW(), '수학2 - 미분계수와 도함수'),
    (26, 1, 2, NOW(), '수학2 - 도함수의 활용'),
    (27, 1, 2, NOW(), '수학2 - 부정적분과 정적분'),
    (28, 1, 2, NOW(), '수학2 - 정적분의 활용'),
    (29, 1, 2, NOW(), '미적분 - 수열의 극한'),
    (30, 1, 2, NOW(), '미적분 - 급수'),
    (31, 1, 2, NOW(), '미적분 - 함수의 미분'),
    (32, 1, 2, NOW(), '미적분 - 미분법'),
    (33, 1, 2, NOW(), '미적분 - 도함수의 활용'),
    (34, 1, 2, NOW(), '미적분 - 적분법'),
    (35, 1, 2, NOW(), '미적분 - 정적분의 활용'),
    (36, 1, 2, NOW(), '확률과 통계 - 순열'),
    (37, 1, 2, NOW(), '확률과 통계 - 중복조합과 이항정리'),
    (38, 1, 2, NOW(), '확률과 통계 - 확률의 뜻과 활용'),
    (39, 1, 2, NOW(), '확률과 통계 - 조건부확률'),
    (40, 1, 2, NOW(), '확률과 통계 - 이산확률변수의 확률분포'),
    (41, 1, 2, NOW(), '확률과 통계 - 연속확률변수의 확률분포'),
    (42, 1, 2, NOW(), '확률과 통계 - 통계적 추정'),
    (43, 1, 2, NOW(), '기하 - 포물선'),
    (44, 1, 2, NOW(), '기하 - 타원'),
    (45, 1, 2, NOW(), '기하 - 쌍곡선'),
    (46, 1, 2, NOW(), '기하 - 벡터의 연산'),
    (47, 1, 2, NOW(), '기하 - 벡터의 내적, 직선과 원의 방정식'),
    (48, 1, 2, NOW(), '기하 - 공간도형'),
    (49, 1, 2, NOW(), '기하 - 공간좌표'),

    -- 영어(3)
    (50, 1, 3, NOW(), '글의 목적 파악'),
    (51, 1, 3, NOW(), '심경/분위기 파악'),
    (52, 1, 3, NOW(), '함축적 의미 파악'),
    (53, 1, 3, NOW(), '요지 파악'),
    (54, 1, 3, NOW(), '주장 파악'),
    (55, 1, 3, NOW(), '주제 파악'),
    (56, 1, 3, NOW(), '제목 파악'),
    (57, 1, 3, NOW(), '도표 정보 파악'),
    (58, 1, 3, NOW(), '내용 일치/불일치(설명문)'),
    (59, 1, 3, NOW(), '내용 일치/불일치(실용문)'),
    (60, 1, 3, NOW(), '어법 정확성 파악'),
    (61, 1, 3, NOW(), '어휘 적절성 파악'),
    (62, 1, 3, NOW(), '빈칸 추론'),
    (63, 1, 3, NOW(), '흐름에 무관한 문장 찾기'),
    (64, 1, 3, NOW(), '글 순서 파악'),
    (65, 1, 3, NOW(), '문장 삽입'),
    (66, 1, 3, NOW(), '문단 요약'),
    (67, 1, 3, NOW(), '장문 독해'),

    -- 한국사(4)
    (68, 1, 4, NOW(), '고대 국가의 정치 · 사회와 문화'),
    (69, 1, 4, NOW(), '고려의 정치 · 사회와 문화'),
    (70, 1, 4, NOW(), '조선 시대 정치 운영과 세계관의 변화'),
    (71, 1, 4, NOW(), '양반 신분제 사회와 상품 화폐 경제'),
    (72, 1, 4, NOW(), '흥선 대원군의 정책과 개항 이후 근대적 개혁의 추진'),
    (73, 1, 4, NOW(), '근대 국가 수립을 위한 노력'),
    (74, 1, 4, NOW(), '일본의 침략 확대와 국권 수호 운동'),
    (75, 1, 4, NOW(), '개항 이후 경제 · 사회 · 문화의 변화'),
    (76, 1, 4, NOW(), '1910~1920년대 일제의 식민지 정책과 3·1 운동 · 대한민국 임시 정부'),
    (77, 1, 4, NOW(), '다양한 민족 운동의 전개'),
    (78, 1, 4, NOW(), '사회 · 문화의 변화와 사회 운동'),
    (79, 1, 4, NOW(), '전시 동원 체제와 광복을 위한 노력'),
    (80, 1, 4, NOW(), '대한민국 정부 수립과 6·25 전쟁'),
    (81, 1, 4, NOW(), '민주화를 위한 노력과 경제 성장'),
    (82, 1, 4, NOW(), '6월 민주 항쟁 이후 사회와 동아시아 평화를 위한 노력'),

    -- 생활과 윤리(5)
    (83, 1, 5, NOW(), '실천 윤리와 윤리 문제에 대한 탐구'),
    (84, 1, 5, NOW(), '윤리 문제에 대한 접근'),
    (85, 1, 5, NOW(), '삶과 죽음의 윤리'),
    (86, 1, 5, NOW(), '생명 윤리'),
    (87, 1, 5, NOW(), '사랑과 성 윤리'),
    (88, 1, 5, NOW(), '직업과 청렴의 윤리'),
    (89, 1, 5, NOW(), '사회 정의와 윤리'),
    (90, 1, 5, NOW(), '국가와 시민의 윤리'),
    (91, 1, 5, NOW(), '과학 기술과 윤리'),
    (92, 1, 5, NOW(), '정보 사회와 윤리'),
    (93, 1, 5, NOW(), '자연과 윤리'),
    (94, 1, 5, NOW(), '예술과 대중문화 윤리'),
    (95, 1, 5, NOW(), '의식주 윤리와 다문화 사회 윤리'),
    (96, 1, 5, NOW(), '갈등 해결과 소통, 민족 통합의 윤리'),
    (97, 1, 5, NOW(), '지구촌 평화의 윤리'),

    -- 윤리와 사상(6)
    (98, 1, 6, NOW(), '인간과 윤리 사상'),
    (99, 1, 6, NOW(), '유교와 인의 윤리'),
    (100, 1, 6, NOW(), '한국 유교와 인간의 도덕적 심성'),
    (101, 1, 6, NOW(), '불교와 자비 및 화합의 윤리'),
    (102, 1, 6, NOW(), '도가 사상과 무위자연의 윤리'),
    (103, 1, 6, NOW(), '한국과 동양 윤리 사상의 의의'),
    (104, 1, 6, NOW(), '서양 윤리 사상의 연원과 덕 있는 삶'),
    (105, 1, 6, NOW(), '행복 추구와 신앙'),
    (106, 1, 6, NOW(), '도덕적 판단과 행동의 근거: 이성과 감정'),
    (107, 1, 6, NOW(), '옳고 그름의 기준: 의무와 결과'),
    (108, 1, 6, NOW(), '현대의 윤리적 삶: 실존주의와 실용주의'),
    (109, 1, 6, NOW(), '사회사상과 이상 사회'),
    (110, 1, 6, NOW(), '국가와 시민'),
    (111, 1, 6, NOW(), '민주주의와 자본주의'),
    (112, 1, 6, NOW(), '평화 사상과 세계 시민 윤리'),

    -- 한국지리(7)
    (113, 1, 7, NOW(), '우리나라의 위치 특성과 영토'),
    (114, 1, 7, NOW(), '국토 인식의 변화와 지리 정보'),
    (115, 1, 7, NOW(), '한반도의 형성과 산지 지형'),
    (116, 1, 7, NOW(), '하천 지형과 해안 지형'),
    (117, 1, 7, NOW(), '화산 지형과 카르스트 지형'),
    (118, 1, 7, NOW(), '우리나라의 기후 특성과 주민 생활'),
    (119, 1, 7, NOW(), '자연재해와 기후 변화'),
    (120, 1, 7, NOW(), '촌락의 변화와 도시 발달'),
    (121, 1, 7, NOW(), '도시 구조와 대도시권'),
    (122, 1, 7, NOW(), '도시 계획과 지역 개발'),
    (123, 1, 7, NOW(), '자원의 의미와 자원 문제'),
    (124, 1, 7, NOW(), '농업의 변화와 공업 발달'),
    (125, 1, 7, NOW(), '교통·통신의 발달과 서비스업의 변화'),
    (126, 1, 7, NOW(), '인구 분포와 인구 구조의 변화'),
    (127, 1, 7, NOW(), '인구 문제와 다문화 공간의 확대'),
    (128, 1, 7, NOW(), '지역의 의미와 북한 지역'),
    (129, 1, 7, NOW(), '수도권과 강원 지방'),
    (130, 1, 7, NOW(), '충청·호남·영남 지방과 제주도'),

    -- 세계지리(8)
    (131, 1, 8, NOW(), '세계화와 지역 이해'),
    (132, 1, 8, NOW(), '세계 기후 구분과 열대 기후'),
    (133, 1, 8, NOW(), '온대 기후'),
    (134, 1, 8, NOW(), '건조 및 냉·한대 기후와 지형'),
    (135, 1, 8, NOW(), '세계의 주요 대지형과 독특한 지형들'),
    (136, 1, 8, NOW(), '주요 종교의 전파와 종교 경관'),
    (137, 1, 8, NOW(), '세계의 인구 변천과 인구 이주'),
    (138, 1, 8, NOW(), '세계의 도시화와 세계 도시 체계'),
    (139, 1, 8, NOW(), '주요 식량 자원과 국제 이동'),
    (140, 1, 8, NOW(), '주요 에너지 자원과 국제 이동'),
    (141, 1, 8, NOW(), '몬순 아시아와 오세아니아 '),
    (142, 1, 8, NOW(), '건조 아시아와 북부 아프리카'),
    (143, 1, 8, NOW(), '유럽과 북부 아메리카'),
    (144, 1, 8, NOW(), '사하라 이남 아프리카와 중·남부 아메리카'),
    (145, 1, 8, NOW(), '평화와 공존의 세계'),

    -- 동아시아사(9)
    (146, 1, 9, NOW(), '동아시아 선사 문화의 전개 ~ 국가의 성립과 발전'),
    (147, 1, 9, NOW(), '인구 이동과 정치·사회 변동'),
    (148, 1, 9, NOW(), '국제 관계의 다원화'),
    (149, 1, 9, NOW(), '유학과 불교'),
    (150, 1, 9, NOW(), '17세기 전후의 동아시아 전쟁'),
    (151, 1, 9, NOW(), '교역망의 발달과 은 유통 ~ 사회 변동과 서민 문화'),
    (152, 1, 9, NOW(), '새로운 국제 질서와 근대화 운동 ~ 서양 문물의 수용'),
    (153, 1, 9, NOW(), '제국주의 침략 전쟁과 민족 운동'),
    (154, 1, 9, NOW(), '제2차 세계 대전 전후 처리와 냉전 체제'),
    (155, 1, 9, NOW(), '동아시아의 경제 성장과 정치 발전 ~ 갈등과 화해'),

    -- 세계사(10)
    (156, 1, 10, NOW(), '인류의 출현과 선사 문화, 문명의 발생'),
    (157, 1, 10, NOW(), '동아시아 세계의 형성'),
    (158, 1, 10, NOW(), '동아시아 세계의 발전 및 변동'),
    (159, 1, 10, NOW(), '서아시아의 여러 제국과 이슬람 세계의 형성'),
    (160, 1, 10, NOW(), '인도의 역사와 다양한 종교·문화의 출현'),
    (161, 1, 10, NOW(), '고대 지중해 세계'),
    (162, 1, 10, NOW(), '유럽 세계의 형성과 변화'),
    (163, 1, 10, NOW(), '시민 혁명과 산업 혁명'),
    (164, 1, 10, NOW(), '제국주의와 민족 운동'),
    (165, 1, 10, NOW(), '두 차례의 세계 대전'),
    (166, 1, 10, NOW(), '냉전과 탈냉전, 21세기의 세계'),

    -- 경제(11)
    (167, 1, 11, NOW(), '희소성과 합리적 선택'),
    (168, 1, 11, NOW(), '경제 체제 및 시장 경제의 원리'),
    (169, 1, 11, NOW(), '가계, 기업, 정부의 경제 활동'),
    (170, 1, 11, NOW(), '시장 가격의 결정과 변동'),
    (171, 1, 11, NOW(), '잉여와 자원 배분의 효율성'),
    (172, 1, 11, NOW(), '수요와 공급의 가격 탄력성'),
    (173, 1, 11, NOW(), '시장 실패와 정부 실패'),
    (174, 1, 11, NOW(), '경제 순환과 경제 성장'),
    (175, 1, 11, NOW(), '실업과 인플레이션'),
    (176, 1, 11, NOW(), '경기 변동과 안정화 정책'),
    (177, 1, 11, NOW(), '무역 원리와 무역 정책'),
    (178, 1, 11, NOW(), '외환 시장과 환율'),
    (179, 1, 11, NOW(), '국제 수지'),
    (180, 1, 11, NOW(), '금융 생활과 신용'),
    (181, 1, 11, NOW(), '금융 상품과 재무 계획'),

    -- 정치와 법(12)
    (182, 1, 12, NOW(), '정치와 법'),
    (183, 1, 12, NOW(), '헌법의 의의와 기본 원리'),
    (184, 1, 12, NOW(), '기본권의 보장과 제한'),
    (185, 1, 12, NOW(), '정부 형태'),
    (186, 1, 12, NOW(), '우리나라의 국가 기관'),
    (187, 1, 12, NOW(), '지방 자치'),
    (188, 1, 12, NOW(), '선거와 선거 제도'),
    (189, 1, 12, NOW(), '정치 과정과 정치 참여'),
    (190, 1, 12, NOW(), '민법의 기초'),
    (191, 1, 12, NOW(), '재산 관계와 법'),
    (192, 1, 12, NOW(), '가족 관계와 법'),
    (193, 1, 12, NOW(), '형법의 이해'),
    (194, 1, 12, NOW(), '형사 절차와 인권 보장'),
    (195, 1, 12, NOW(), '근로자의 권리'),
    (196, 1, 12, NOW(), '국제 관계와 국제법'),
    (197, 1, 12, NOW(), '국제 문제와 국제기구'),

    -- 사회 문화(13)
    (198, 1, 13, NOW(), '사회·문화 현상의 이해'),
    (199, 1, 13, NOW(), '사회·문화 현상의 연구 방법'),
    (200, 1, 13, NOW(), '자료 수집 방법 16'),
    (201, 1, 13, NOW(), '사회·문화 현상의 탐구 태도와 연구 윤리'),
    (202, 1, 13, NOW(), '사회적 존재로서의 인간'),
    (203, 1, 13, NOW(), '사회 집단과 사회 조직'),
    (204, 1, 13, NOW(), '사회 구조와 일탈 행동'),
    (205, 1, 13, NOW(), '문화의 이해'),
    (206, 1, 13, NOW(), '현대 사회의 문화 양상'),
    (207, 1, 13, NOW(), '문화 변동의 양상과 대응'),
    (208, 1, 13, NOW(), '사회 불평등 현상의 이해'),
    (209, 1, 13, NOW(), '사회 이동과 사회 계층 구조'),
    (210, 1, 13, NOW(), '다양한 사회 불평등 현상'),
    (211, 1, 13, NOW(), '사회 복지와 복지 제도'),
    (212, 1, 13, NOW(), '사회 변동과 사회 운동'),
    (213, 1, 13, NOW(), '현대 사회의 변화와 전 지구적 수준의 문제'),

    -- 물리학1(14)
    (214, 1, 14, Now(), '힘과 운동'),
    (215, 1, 14, Now(), '운동량과 충격량'),
    (216, 1, 14, Now(), '역학적 에너지 보존'),
    (217, 1, 14, Now(), '열역학 법칙'),
    (218, 1, 14, Now(), '시간과 공간'),
    (219, 1, 14, Now(), '물질의 전기적 특성'),
    (220, 1, 14, Now(), '물질의 자기적 특성'),
    (221, 1, 14, Now(), '파동의 성질과 활용'),
    (222, 1, 14, Now(), '빛과 물질의 이중성'),

    -- 물리학2(15)
    (223, 1, 15, NOW(), '힘과 평형'),
    (224, 1, 15, NOW(), '물체의 운동'),
    (225, 1, 15, NOW(), '일반 상대성 이론'),
    (226, 1, 15, NOW(), '일과 에너지'),
    (227, 1, 15, NOW(), '전기장과 정전기 유도'),
    (228, 1, 15, NOW(), '저항의 연결과 전기 에너지'),
    (229, 1, 15, NOW(), '트랜지스터와 축전기'),
    (230, 1, 15, NOW(), '전류에 의한 자기장'),
    (231, 1, 15, NOW(), '전자기 유도와 상호유도'),
    (232, 1, 15, NOW(), '전자기파의 간섭과 회절'),
    (233, 1, 15, NOW(), '도플러 효과와 전자기파의 송수신'),
    (234, 1, 15, NOW(), '볼록 렌즈에 의한 상'),
    (235, 1, 15, NOW(), '빛과 물질의 이중성'),
    (236, 1, 15, NOW(), '불확정성 원리'),

    -- 화학1(16)
    (237, 1, 16, NOW(), '우리 생활 속의 화학'),
    (238, 1, 16, NOW(), '화학식량과 몰'),
    (239, 1, 16, NOW(), '화학 반응식과 용액의 농도'),
    (240, 1, 16, NOW(), '원자의 구조'),
    (241, 1, 16, NOW(), '현대적 원자 모형과 전자 배치'),
    (242, 1, 16, NOW(), '원소의 주기적 성질'),
    (243, 1, 16, NOW(), '이온 결합'),
    (244, 1, 16, NOW(), '공유 결합과 결합의 극성'),
    (245, 1, 16, NOW(), '분자의 구조와 성질'),
    (246, 1, 16, NOW(), '동적 평형'),
    (247, 1, 16, NOW(), '산 염기와 중화 반응'),
    (248, 1, 16, NOW(), '산화 환원 반응과 화학 반응에서 출입하는 열'),

    -- 화학2(17)
    (249, 1, 17, NOW(), '기체'),
    (250, 1, 17, NOW(), '액체와 고체'),
    (251, 1, 17, NOW(), '용액'),
    (252, 1, 17, NOW(), '반응 엔탈피'),
    (253, 1, 17, NOW(), '화학 평형과 평형 이동'),
    (254, 1, 17, NOW(), '산 염기 평형'),
    (255, 1, 17, NOW(), '반응 속도'),
    (256, 1, 17, NOW(), '반응 속도에 영향을 미치는 요인'),
    (257, 1, 17, NOW(), '전기 화학과 이용'),

    -- 생명과학1(18)
    (258, 1, 18, NOW(), '생명 과학의 이해'),
    (259, 1, 18, NOW(), '생명 활동과 에너지'),
    (260, 1, 18, NOW(), '물질대사와 건강'),
    (261, 1, 18, NOW(), '자극의 전달'),
    (262, 1, 18, NOW(), '신경계'),
    (263, 1, 18, NOW(), '항상성'),
    (264, 1, 18, NOW(), '방어 작용'),
    (265, 1, 18, NOW(), '유전 정보와 염색체'),
    (266, 1, 18, NOW(), '사람의 유전'),
    (267, 1, 18, NOW(), '사람의 유전병'),
    (268, 1, 18, NOW(), '생태계의 구성과 기능'),
    (269, 1, 18, NOW(), '에너지 흐름과 물질 순환, 생물 다양성'),

    -- 생명과학2(19)
    (270, 1, 19, NOW(), '생명 과학의 역사'),
    (271, 1, 19, NOW(), '세포의 특성'),
    (272, 1, 19, NOW(), '세포막과 효소'),
    (273, 1, 19, NOW(), '세포 호흡과 발효'),
    (274, 1, 19, NOW(), '광합성'),
    (275, 1, 19, NOW(), '유전 물질'),
    (276, 1, 19, NOW(), '유전자 발현'),
    (277, 1, 19, NOW(), '유전자 발현의 조절'),
    (278, 1, 19, NOW(), '생명의 기원'),
    (279, 1, 19, NOW(), '생물의 분류와 다양성'),
    (280, 1, 19, NOW(), '진화의 원리'),
    (281, 1, 19, NOW(), '생명 공학 기술과 인간 생활'),

    -- 지구과학1(20)
    (282, 1, 20, NOW(), '판 구조론과 대륙 분포의 변화'),
    (283, 1, 20, NOW(), '판 이동의 원동력과 마그마 활동'),
    (284, 1, 20, NOW(), '퇴적암과 지질 구조'),
    (285, 1, 20, NOW(), '지구의 역사'),
    (286, 1, 20, NOW(), '대기의 변화'),
    (287, 1, 20, NOW(), '해양의 변화'),
    (288, 1, 20, NOW(), '대기와 해양의 상호 작용'),
    (289, 1, 20, NOW(), '별의 특성'),
    (290, 1, 20, NOW(), '외계 행성계와 외계 생명체 탐사'),
    (291, 1, 20, NOW(), '외부 은하와 우주 팽창'),

    -- 지구과학2(21)
    (292, 1, 21, NOW(), '지구의 형성과 역장'),
    (293, 1, 21, NOW(), '광물'),
    (294, 1, 21, NOW(), '지구의 자원'),
    (295, 1, 21, NOW(), '한반도의 지질'),
    (296, 1, 21, NOW(), '해수의 운동과 순환'),
    (297, 1, 21, NOW(), '대기 안정도'),
    (298, 1, 21, NOW(), '대기의 운동과 대기 대순환'),
    (299, 1, 21, NOW(), '행성의 운동'),
    (300, 1, 21, NOW(), '우리은하와 우주의 구조')
;

/*!40000 ALTER TABLE `t_category` ENABLE KEYS */;
UNLOCK TABLES;


/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-07 13:54:05
