/*
 Navicat Premium Data Transfer

 Source Server         : dbcon
 Source Server Type    : MySQL
 Source Server Version : 80032
 Source Host           : localhost:3306
 Source Schema         : my_finances

 Target Server Type    : MySQL
 Target Server Version : 80032
 File Encoding         : 65001

 Date: 09/02/2023 05:03:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for entities
-- ----------------------------
DROP TABLE IF EXISTS `entities`;
CREATE TABLE `entities`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of entities
-- ----------------------------
INSERT INTO `entities` VALUES (1, 'system');
INSERT INTO `entities` VALUES (2, 'Joseph Guzman');
INSERT INTO `entities` VALUES (3, 'Percifit - on Amazon');
INSERT INTO `entities` VALUES (4, 'Giuseppe Todaro');
INSERT INTO `entities` VALUES (5, 'Adidas - on asos');
INSERT INTO `entities` VALUES (6, 'Putia Signora');
INSERT INTO `entities` VALUES (7, 'Gym Adrano');

-- ----------------------------
-- Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `group_hidden` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of groups
-- ----------------------------
INSERT INTO `groups` VALUES (1, 'Gym Diet', '0');
INSERT INTO `groups` VALUES (2, 'Gym Suit', '0');
INSERT INTO `groups` VALUES (3, 'PTP Movements', '1');
INSERT INTO `groups` VALUES (4, 'Personal Care', '0');

-- ----------------------------
-- Table structure for groups_items
-- ----------------------------
DROP TABLE IF EXISTS `groups_items`;
CREATE TABLE `groups_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NULL DEFAULT NULL,
  `item_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of groups_items
-- ----------------------------
INSERT INTO `groups_items` VALUES (1, 2, 6);
INSERT INTO `groups_items` VALUES (6, 3, -1);
INSERT INTO `groups_items` VALUES (7, 4, 7);

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of items
-- ----------------------------
INSERT INTO `items` VALUES (2, 'Gym Subscription');
INSERT INTO `items` VALUES (3, 'PROVO Allenatore Mascella, Jaw Exerciser');
INSERT INTO `items` VALUES (6, 'adidas Originals adicolor joggers in grey heather');
INSERT INTO `items` VALUES (7, 'Deodorante');
INSERT INTO `items` VALUES (8, 'JoyStick');

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NULL DEFAULT NULL,
  `price` decimal(11, 4) NULL DEFAULT NULL,
  `eid_from` int NULL DEFAULT NULL COMMENT 'entity id from',
  `eid_to` int NULL DEFAULT NULL COMMENT 'entity id to',
  `time_stamp` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of transactions
-- ----------------------------
INSERT INTO `transactions` VALUES (1, -1, 36.0000, 1, 2, '2023-02-08 16:51:43.000012');
INSERT INTO `transactions` VALUES (2, -1, 0.5200, 2, 4, '2023-02-07 08:52:15.000000');
INSERT INTO `transactions` VALUES (3, 6, 61.9300, 2, 5, '2023-02-08 20:35:57.000000');
INSERT INTO `transactions` VALUES (4, 3, 9.4900, 2, 3, '2023-02-08 20:37:43.000000');
INSERT INTO `transactions` VALUES (5, 7, 3.0000, 2, 6, '2023-02-08 22:25:26.000000');
INSERT INTO `transactions` VALUES (6, 7, 3.0000, 2, 6, '2023-02-08 23:31:29.000000');
INSERT INTO `transactions` VALUES (7, 8, 20.0000, 4, 2, '2023-02-08 23:42:40.000000');
INSERT INTO `transactions` VALUES (8, 8, 35.0000, 4, 2, '2023-02-08 23:43:52.000000');
INSERT INTO `transactions` VALUES (9, 8, 10.0000, 2, 4, '2023-02-08 23:44:28.000000');
INSERT INTO `transactions` VALUES (10, 8, 60.0000, 2, 4, '2023-02-08 23:45:13.000000');
INSERT INTO `transactions` VALUES (11, 2, 100.0000, 2, 7, '2023-02-09 04:56:48.000000');

SET FOREIGN_KEY_CHECKS = 1;
