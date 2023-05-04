# Python_Django_School_Competition_Management
Python基于Django学校比赛管理网站设计毕业源码案例设计

## 技术环境: PyCharm + Django2.2 + Python3.7 + mysql

### 运动员：
  报名（啥项目田径，跳高，羽毛球等等），查看参赛名单，查看赛场安排（一个场地一天时间，然后比如上午10点到11点安排啥赛事一场，不用考虑该运动员的自己的赛场安排赛事安排，查看管理员安排的公共的就行），修改个人信息，查看自己的积分记录，发布管理留言，查询新闻公告。

### 管理员：
  报名管理，运动员管理，参赛名单管理，积分管理，医护团队管理，赛场编排管理（场地的增删改查，只是对比赛场地的安排，某某场地，某某时间段，什么比赛，然后安排上赛事就行了，一个场地一天几场赛事，啥赛事），然后用饼图某某得分阶段哪种比赛占比多，或者自己发挥3个统计图
### 实体ER属性：
用户: 用户名,登录密码,姓名,性别,出生日期,用户照片,身高,体重,联系电话,邮箱,家庭地址,注册时间

比赛项目: 类别编号,类别名称,类别描述

比赛: 比赛id,比赛项目,比赛名称,比赛照片,比赛地点,比赛介绍,举办方,人数限制,报名开始时间,截止报名时间,已报名人数

学生报名: 报名id,报名用户,报名比赛,比赛项目,报名时间,审核状态,审核回复

赛场安排: 记录id,比赛项目,所属比赛,场次名称,比赛场地,参赛选手,对阵选手,比赛开始时间,比赛结束时间,比赛结果,附加信息

比赛场地: 场地编号,运动项目,场地名称,场地面积,场地照片,投入使用时间,场地描述

比赛积分: 积分id,比赛场次,比赛名称,比赛用户,用户积分,附加信息,添加时间

医护团队: 团队id,团队名称,团队照片,使用状态,成立日期,负责人,联系电话,团队介绍

留言: 留言id,留言标题,留言内容,留言人,留言时间,管理回复,回复时间

新闻公告: 公告id,标题,公告内容,发布时间
