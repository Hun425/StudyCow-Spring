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
/*!40103 SET TIME_ZONE='+00:00' */;
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
  `cat_name` varchar(30) DEFAULT NULL,
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
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-02 10:49:46

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
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;



--
-- Dumping data for table `t_grade_code`
--

LOCK TABLES `t_grade_code` WRITE;
/*!40000 ALTER TABLE `t_grade_code` DISABLE KEYS */;
INSERT INTO `t_grade_code` VALUES (1,1000,0,'브론즈'),(2,5000,1001,'실버'),(3,10000,5001,'골드'),(4,30000,10001,'플래티넘'),(5,999999999,30001,'다이아');
/*!40000 ALTER TABLE `t_grade_code` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-30 14:09:03


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
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


--
-- Dumping data for table `t_subject_code`
--

LOCK TABLES `t_subject_code` WRITE;
/*!40000 ALTER TABLE `t_subject_code` DISABLE KEYS */;
INSERT INTO `t_subject_code` VALUES (1,100,1,'2024-07-22 09:47:26.000000','국어'),(2,100,1,'2024-07-22 09:47:26.000000','수학'),(3,100,1,'2024-07-22 09:47:26.000000','영어'),(4,50,1,'2024-07-22 09:47:26.000000','한국사'),(5,50,1,'2024-07-22 09:47:26.000000','사회탐구'),(6,50,1,'2024-07-22 09:47:26.000000','과학탐구'),(7,50,1,'2024-07-22 09:47:26.000000','직업탐구'),(8,50,1,'2024-07-22 09:47:26.000000','제2외국어/한문');
/*!40000 ALTER TABLE `t_subject_code` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-30 14:09:03


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
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


--
-- Dumping data for table `t_category`
--

LOCK TABLES `t_category` WRITE;
/*!40000 ALTER TABLE `t_category` DISABLE KEYS */;
INSERT INTO `t_category` VALUES (1,1,1,'2024-07-22 10:26:01.000000','독서'),(2,1,1,'2024-07-22 10:26:01.000000','문학'),(3,1,1,'2024-07-22 10:26:01.000000','화법과 작문'),(4,1,1,'2024-07-22 10:26:01.000000','언어와 매체'),(5,1,2,'2024-07-22 10:26:01.000000','수학1'),(6,1,2,'2024-07-22 10:26:01.000000','수학2'),(7,1,2,'2024-07-22 10:26:01.000000','미적분'),(8,1,2,'2024-07-22 10:26:01.000000','기하'),(9,1,2,'2024-07-22 10:26:01.000000','확률과 통계'),(10,1,3,'2024-07-22 10:26:01.000000','듣기'),(11,1,3,'2024-07-22 10:26:01.000000','읽기'),(12,1,4,'2024-07-22 10:26:01.000000','한국사'),(13,1,5,'2024-07-22 10:26:01.000000','생활과 윤리'),(14,1,5,'2024-07-22 10:26:01.000000','윤리와 사상'),(15,1,5,'2024-07-22 10:26:01.000000','한국지리'),(16,1,5,'2024-07-22 10:26:01.000000','세계지리'),(17,1,5,'2024-07-22 10:26:01.000000','동아시아사'),(18,1,5,'2024-07-22 10:26:01.000000','세계사'),(19,1,5,'2024-07-22 10:26:01.000000','경제'),(20,1,5,'2024-07-22 10:26:01.000000','정치와 법'),(21,1,5,'2024-07-22 10:26:01.000000','사회 문화'),(22,1,6,'2024-07-22 10:26:01.000000','물리학1'),(23,1,6,'2024-07-22 10:26:01.000000','물리학2'),(24,1,6,'2024-07-22 10:26:01.000000','화학1'),(25,1,6,'2024-07-22 10:26:01.000000','화학2'),(26,1,6,'2024-07-22 10:26:01.000000','생명과학1'),(27,1,6,'2024-07-22 10:26:01.000000','생명과학2'),(28,1,6,'2024-07-22 10:26:01.000000','지구과학1'),(29,1,6,'2024-07-22 10:26:01.000000','지구과학2'),(30,1,7,'2024-07-22 10:26:01.000000','농업 기초 기술'),(31,1,7,'2024-07-22 10:26:01.000000','공업 일반'),(32,1,7,'2024-07-22 10:26:01.000000','상업 경제'),(33,1,7,'2024-07-22 10:26:01.000000','수산 해운 산업 기초'),(34,1,7,'2024-07-22 10:26:01.000000','인간 발달'),(35,1,7,'2024-07-22 10:26:01.000000','성공적인 직업생활'),(36,1,8,'2024-07-22 10:26:01.000000','독일어1'),(37,1,8,'2024-07-22 10:26:01.000000','프랑스어1'),(38,1,8,'2024-07-22 10:26:01.000000','스페인어1'),(39,1,8,'2024-07-22 10:26:01.000000','중국어1'),(40,1,8,'2024-07-22 10:26:01.000000','일본어1'),(41,1,8,'2024-07-22 10:26:01.000000','러시아어1'),(42,1,8,'2024-07-22 10:26:01.000000','아랍어1'),(43,1,8,'2024-07-22 10:26:01.000000','베트남어1'),(44,1,8,'2024-07-22 10:26:01.000000','한문1');
/*!40000 ALTER TABLE `t_category` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-30 14:09:03


