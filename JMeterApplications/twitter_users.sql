CREATE DATABASE  IF NOT EXISTS `twitter` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `twitter`;
-- MySQL dump 10.13  Distrib 5.5.47, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: twitter
-- ------------------------------------------------------
-- Server version	5.5.47-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) NOT NULL,
  `password` varchar(500) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phonenum` varchar(45) DEFAULT '0',
  `countrycode` varchar(5) DEFAULT '0',
  `username` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=169 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (152,'Ankil Shah','$2a$10$2Z3XqnvrOTlJLKSYodOlDeEmzLgG5abzZglgKQPu9j2IwAWVy.iIO','ankil.shah2003@gmail.com','6692259702','1','@fun'),(153,'Shruti Patel','$2a$10$CVCsXfqhH5NAklQ.rCRXreQLIthRS3.HDEwvIb32eShjWSLPf07k6','sr@yahoo.com','8787877','213','@shruti'),(154,'Steven','$2a$10$N3rJ9cuouxjd.dm0WfhmOO.zC7JfCebY3VCczXGF/eLz/AMiPtSfG','st@something.com','0','0','@st'),(155,'Bhargav','$2a$10$rBuilbfl.XTsGTf7S4eOwOLAzB2QQHFfopuP7qJJMgd/wKO/ammkW','bh@gmail.com','5757575','1268','@bh'),(156,'Sarvh','$2a$10$7eGxB4SiGZDnmD/A9YkdOO8o3fziszLQwHp1i8135QyyAFili/tzu','sarv@hjhjh.com','767676','1','@rtyioob'),(157,'Complete','$2a$10$U0xK1XHhq5SkPJwMSM2J5On7DwnqjirvrOHgY/naf0oYr3VysaQXu','com@yahoo.co.in','87787877','1264','@gggg'),(158,'Yankeei','$2a$10$ZQy9sPGpePmUz2XWLCfHhehO1tarTgZz7pqBDOV0cZ3IAZUjxnSfq','abc@jbhb.com','868688','1','@ghgg'),(159,'Bhavin','$2a$10$ptE2uRvzZLwTEx7p.3wXoOLOnGRuivcCtXF3EmoExSsm4.qhUzEbS','bh@uhgjhj.com','676','376','@bhavin007'),(160,'Pjhjhj','$2a$10$tWGtlBWsZN6n0QMl7pGjfe9f8OBoU0w52KRQDMzWw5q52PI7ODIiy','bhbhh@jbjh.com','7800808908','376','@iyiu'),(161,'tytyyt','$2a$10$SC5CFB6UqWJIuL5hpcOCveUwqCB4STI1NMha5Cl4kiahrgx4ix/jm','tftftf@ughug.com','0','0','@uyuy'),(162,'ugughjbjhb','$2a$10$Ir0waOL08n8uSTywxwMKT.06xHvFE3laAIgyMg2BpjX7Zb1aTqPp2','jgjghjghj@jkjk.com','0','0','@iyiyiyi'),(163,'kuguigugu','$2a$10$CAhsqqm8nrCc4BhkjzL0tu2w3oeJD2jzb8A/sR5GkMQNzTyR3Rdt6','hghg@jhjh.comh','0','0','@iuiuiui'),(164,'ytyggkgky@ujhujh.com','$2a$10$kmnGDQ5IXEj3K11lj7W3guLgXXnXYWma4UMv/pNv9XxnFLxIJ7MiK','uhjh@ujgujg.com','0','0','@iojuiui'),(165,'hguguihuihihii','$2a$10$/iV4SQAAauc90u8q2JnDJeMw50KU/h9BCVSsQ0/6kZosv9FmNNNJq','hjkhjhj@ijkij.com','0','0','@pioipio'),(166,'iuuiuyiuiuiu','$2a$10$v39ei1C6Q33CX0O/kDyg7usE1n6j4cAeSALYVH0YnTxkBIVdNL/tu','iuiuiuiu@kjk.com','0','0','@uyuyuy'),(167,'Ankil Shah','$2a$10$QIyC2YMI7prS8zY0TEcmi.pTBMncYIqCmPHEqix2GzxVhvnbEbVSm','ankil@jbn.com','0','0','@trademark'),(168,'hihiih','$2a$10$JfqWCVNn2HvxJMV/WYjUbuwezj6RmC9z5loZIyaVThCH0Zh1w/XSO','1hhgkgkg@v.com','0','0','@ijbu');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-01 13:26:10
