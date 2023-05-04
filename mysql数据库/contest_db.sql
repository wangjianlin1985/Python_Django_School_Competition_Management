/*
 Navicat Premium Data Transfer

 Source Server         : mysql5.6_20210415
 Source Server Type    : MySQL
 Source Server Version : 50620
 Source Host           : localhost:3306
 Source Schema         : contest_db

 Target Server Type    : MySQL
 Target Server Version : 50620
 File Encoding         : 65001

 Date: 23/04/2021 02:08:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin`  (
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES ('a', 'a');

-- ----------------------------
-- Table structure for t_contest
-- ----------------------------
DROP TABLE IF EXISTS `t_contest`;
CREATE TABLE `t_contest`  (
  `contestId` int(11) NOT NULL AUTO_INCREMENT COMMENT '比赛id',
  `contestItemObj` int(11) NOT NULL COMMENT '比赛项目',
  `contestName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '比赛名称',
  `contestPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '比赛照片',
  `contestPlace` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '比赛地点',
  `contentDesc` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '比赛介绍',
  `jubanfang` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '举办方',
  `personNum` int(11) NOT NULL COMMENT '人数限制',
  `startTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '报名开始时间',
  `endTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '截止报名时间',
  `signUpNum` int(11) NOT NULL COMMENT '已报名人数',
  PRIMARY KEY (`contestId`) USING BTREE,
  INDEX `contestItemObj`(`contestItemObj`) USING BTREE,
  CONSTRAINT `t_contest_ibfk_1` FOREIGN KEY (`contestItemObj`) REFERENCES `t_contestitem` (`classId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_contest
-- ----------------------------
INSERT INTO `t_contest` VALUES (1, 1, '2021春季男子乒乓球比赛', 'img/ppq.jpg', '学校体育馆', '<p>乒乓球比赛，欢迎大家观看</p>', '大学体育部', 30, '2021-04-14 02:26:27', '2021-04-28 02:26:30', 1);
INSERT INTO `t_contest` VALUES (2, 2, '2021春季羽毛球个人赛', 'img/ymqbs.jpg', '学校体育馆', '<p>咱们来一场真正的较量吧！</p>', '学校体育部', 50, '2021-04-22 01:33:02', '2021-04-30 01:33:03', 2);

-- ----------------------------
-- Table structure for t_contestitem
-- ----------------------------
DROP TABLE IF EXISTS `t_contestitem`;
CREATE TABLE `t_contestitem`  (
  `classId` int(11) NOT NULL AUTO_INCREMENT COMMENT '类别编号',
  `className` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类别名称',
  `classDesc` varchar(800) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类别描述',
  PRIMARY KEY (`classId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_contestitem
-- ----------------------------
INSERT INTO `t_contestitem` VALUES (1, '乒乓球', '咱们的国球，要发扬光大');
INSERT INTO `t_contestitem` VALUES (2, '羽毛球', '锻炼身体的');
INSERT INTO `t_contestitem` VALUES (3, '跳高', '锻炼下肢及全身');

-- ----------------------------
-- Table structure for t_contestplace
-- ----------------------------
DROP TABLE IF EXISTS `t_contestplace`;
CREATE TABLE `t_contestplace`  (
  `placeNo` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'placeNo',
  `contestItemObj` int(11) NOT NULL COMMENT '运动项目',
  `placeName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '场地名称',
  `placeArea` float NOT NULL COMMENT '场地面积',
  `placePhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '场地照片',
  `useDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '投入使用时间',
  `placeDesc` varchar(800) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '场地描述',
  PRIMARY KEY (`placeNo`) USING BTREE,
  INDEX `contestItemObj`(`contestItemObj`) USING BTREE,
  CONSTRAINT `t_contestplace_ibfk_1` FOREIGN KEY (`contestItemObj`) REFERENCES `t_contestitem` (`classId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_contestplace
-- ----------------------------
INSERT INTO `t_contestplace` VALUES ('CD001', 1, '乒乓球场地A', 22, 'img/ppqcd.jpg', '2021-04-05', '面积大，适合自由发挥');
INSERT INTO `t_contestplace` VALUES ('CD002', 2, '羽毛球场地A', 25, 'img/ymqcd.jpeg', '2021-04-15', '场地大，投入使用不久，很新');

-- ----------------------------
-- Table structure for t_court
-- ----------------------------
DROP TABLE IF EXISTS `t_court`;
CREATE TABLE `t_court`  (
  `courtId` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录id',
  `contestItemObj` int(11) NOT NULL COMMENT '比赛项目',
  `contestObj` int(11) NOT NULL COMMENT '所属比赛',
  `courtName` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '场次名称',
  `contestPlaceObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '比赛场地',
  `userObj1` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '参赛选手',
  `userObj2` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对阵选手',
  `startTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '比赛开始时间',
  `endTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '比赛结束时间',
  `contestResult` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '比赛结果',
  `courtMemo` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '附加信息',
  PRIMARY KEY (`courtId`) USING BTREE,
  INDEX `contestItemObj`(`contestItemObj`) USING BTREE,
  INDEX `contestObj`(`contestObj`) USING BTREE,
  INDEX `contestPlaceObj`(`contestPlaceObj`) USING BTREE,
  INDEX `userObj1`(`userObj1`) USING BTREE,
  INDEX `userObj2`(`userObj2`) USING BTREE,
  CONSTRAINT `t_court_ibfk_1` FOREIGN KEY (`contestItemObj`) REFERENCES `t_contestitem` (`classId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_court_ibfk_2` FOREIGN KEY (`contestObj`) REFERENCES `t_contest` (`contestId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_court_ibfk_3` FOREIGN KEY (`contestPlaceObj`) REFERENCES `t_contestplace` (`placeNo`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_court_ibfk_4` FOREIGN KEY (`userObj1`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_court_ibfk_5` FOREIGN KEY (`userObj2`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_court
-- ----------------------------
INSERT INTO `t_court` VALUES (1, 1, 1, '男子乒乓球赛第1场', 'CD001', 'user1', 'user2', '2021-04-20 02:28:53', '2021-04-20 04:28:54', '7:5', '精彩啊');
INSERT INTO `t_court` VALUES (2, 2, 2, '羽毛球个人赛第1场', 'CD002', 'user2', 'user3', '2021-04-28 01:37:25', '2021-04-28 03:37:30', '未比赛', 'test');
INSERT INTO `t_court` VALUES (3, 2, 2, '羽毛球个人赛第2场', 'CD002', 'user2', 'user3', '2021-04-23 01:44:54', '2021-04-23 03:44:56', '5:3', '测试');

-- ----------------------------
-- Table structure for t_doctorteam
-- ----------------------------
DROP TABLE IF EXISTS `t_doctorteam`;
CREATE TABLE `t_doctorteam`  (
  `teamId` int(11) NOT NULL AUTO_INCREMENT COMMENT '团队id',
  `teamName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '团队名称',
  `teamPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '团队照片',
  `useState` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '使用状态',
  `bornDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '成立日期',
  `chargeMan` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '负责人',
  `connectPhone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `teamDesc` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '团队介绍',
  PRIMARY KEY (`teamId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_doctorteam
-- ----------------------------
INSERT INTO `t_doctorteam` VALUES (1, '生命医疗队', 'img/yliaodui1.jpg', '空闲中', '2021-04-06', '李小涛', '13508208342', '<p>生命第一个，医疗队工作多年，经验丰富！</p>');
INSERT INTO `t_doctorteam` VALUES (2, '天使医疗队', 'img/yld2.jpeg', '空闲中', '2021-04-07', '王婷', '13590820924', '<p>人间的天使，生命的守护者！</p>');

-- ----------------------------
-- Table structure for t_jifen
-- ----------------------------
DROP TABLE IF EXISTS `t_jifen`;
CREATE TABLE `t_jifen`  (
  `jifenId` int(11) NOT NULL AUTO_INCREMENT COMMENT '积分id',
  `courtObj` int(11) NOT NULL COMMENT '比赛场次',
  `contentObj` int(11) NOT NULL COMMENT '比赛名称',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '比赛用户',
  `score` float NOT NULL COMMENT '用户积分',
  `jifenMemo` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '附加信息',
  `addTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '添加时间',
  PRIMARY KEY (`jifenId`) USING BTREE,
  INDEX `courtObj`(`courtObj`) USING BTREE,
  INDEX `contentObj`(`contentObj`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_jifen_ibfk_1` FOREIGN KEY (`courtObj`) REFERENCES `t_court` (`courtId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_jifen_ibfk_2` FOREIGN KEY (`contentObj`) REFERENCES `t_contest` (`contestId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_jifen_ibfk_3` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_jifen
-- ----------------------------
INSERT INTO `t_jifen` VALUES (1, 1, 1, 'user1', 20, '赢了', '2021-04-20 02:29:33');
INSERT INTO `t_jifen` VALUES (2, 1, 1, 'user2', 15, '测试', '2021-04-23 01:47:44');
INSERT INTO `t_jifen` VALUES (3, 2, 2, 'user2', 18, '测试', '2021-04-23 01:48:21');

-- ----------------------------
-- Table structure for t_leaveword
-- ----------------------------
DROP TABLE IF EXISTS `t_leaveword`;
CREATE TABLE `t_leaveword`  (
  `leaveWordId` int(11) NOT NULL AUTO_INCREMENT COMMENT '留言id',
  `leaveTitle` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言标题',
  `leaveContent` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言内容',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言人',
  `leaveTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '留言时间',
  `replyContent` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '管理回复',
  `replyTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '回复时间',
  PRIMARY KEY (`leaveWordId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_leaveword_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_leaveword
-- ----------------------------
INSERT INTO `t_leaveword` VALUES (1, '我想报名跳高', '我可以挑很高！', 'user1', '2021-04-05 02:30:07', '欢迎来战', '2021-04-20 02:30:13');
INSERT INTO `t_leaveword` VALUES (2, '我想报名乒乓球', '我的乒乓球技术好，想来', 'user2', '2021-04-23 01:50:08', '想来就来吧！', '2021-04-23 01:50:14');

-- ----------------------------
-- Table structure for t_notice
-- ----------------------------
DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE `t_notice`  (
  `noticeId` int(11) NOT NULL AUTO_INCREMENT COMMENT '公告id',
  `title` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `content` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '公告内容',
  `publishDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`noticeId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_notice
-- ----------------------------
INSERT INTO `t_notice` VALUES (1, '比赛网成立了！', '<p>以后有关篮球比赛的新闻都来这里吧！</p>', '2021-04-20 02:30:20');

-- ----------------------------
-- Table structure for t_signup
-- ----------------------------
DROP TABLE IF EXISTS `t_signup`;
CREATE TABLE `t_signup`  (
  `signUpId` int(11) NOT NULL AUTO_INCREMENT COMMENT '报名id',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '报名用户',
  `contestObj` int(11) NOT NULL COMMENT '报名比赛',
  `contestItemObj` int(11) NOT NULL COMMENT '比赛项目',
  `signUpTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '报名时间',
  `shenHeState` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '审核状态',
  `shenHeReply` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '审核回复',
  PRIMARY KEY (`signUpId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  INDEX `contestObj`(`contestObj`) USING BTREE,
  INDEX `contestItemObj`(`contestItemObj`) USING BTREE,
  CONSTRAINT `t_signup_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_signup_ibfk_2` FOREIGN KEY (`contestObj`) REFERENCES `t_contest` (`contestId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_signup_ibfk_3` FOREIGN KEY (`contestItemObj`) REFERENCES `t_contestitem` (`classId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_signup
-- ----------------------------
INSERT INTO `t_signup` VALUES (1, 'user1', 1, 1, '2021-04-20 02:26:54', '审核通过', '来吧');
INSERT INTO `t_signup` VALUES (7, 'user2', 1, 1, '2021-04-22 01:53:01', '审核通过', '大赛等你来');
INSERT INTO `t_signup` VALUES (8, 'user2', 2, 2, '2021-04-22 01:53:16', '审核通过', '运动向你招手');

-- ----------------------------
-- Table structure for t_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_userinfo`;
CREATE TABLE `t_userinfo`  (
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'user_name',
  `password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '登录密码',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `gender` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `birthDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '出生日期',
  `userPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户照片',
  `personHeight` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '身高',
  `personWeight` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '体重',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱',
  `address` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '家庭地址',
  `regTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`user_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_userinfo
-- ----------------------------
INSERT INTO `t_userinfo` VALUES ('user1', '123', '张熙桐', '男', '2021-04-07', 'img/9.jpg', '167', '52', '13598092342', 'xitong@163.com', '四川成都红星路5号', '2021-04-20 02:25:42');
INSERT INTO `t_userinfo` VALUES ('user2', '123', '王喜天', '男', '2021-04-07', 'img/7.jpg', '170', '58', '13590823942', 'xitian@126.com', '四川达州', '2021-04-20 02:27:28');
INSERT INTO `t_userinfo` VALUES ('user3', '123', '李明明', '男', '2021-04-01', 'img/12.jpg', '168', '55', '13058019334', 'dashn@126.com', '四川成都红星路10', '2021-04-23 01:20:31');

SET FOREIGN_KEY_CHECKS = 1;
