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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-30 14:09:03
