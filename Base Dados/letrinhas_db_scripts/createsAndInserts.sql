SET foreign_key_checks = 0;

DROP TABLE IF EXISTS Areas;

CREATE TABLE Areas (
	id INT PRIMARY KEY AUTO_INCREMENT,
	description VARCHAR(80)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS Tests;

CREATE TABLE Tests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  areaId INT,
  professorId INT,
  title VARCHAR(50),
  mainText VARCHAR(80),
  creationDate TIMESTAMP default now(),
  grade INT(1),
  type int,

  CONSTRAINT Tests_FK_Professors FOREIGN KEY (professorId) REFERENCES Professors (id),
  CONSTRAINT Tests_FK_Areas FOREIGN KEY (areaId) REFERENCES Areas (id)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS ReadingTests;

CREATE TABLE ReadingTests (
  id INT PRIMARY KEY,
  textContent TEXT,
  professorAudioUrl VARCHAR(100),

  CONSTRAINT ReadingTests_FK_Tests FOREIGN KEY (id) REFERENCES Tests (id)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS MultimediaTests;

CREATE TABLE MultimediaTests (
  id INT PRIMARY KEY,
  questionContent VARCHAR(200),
  contentIsUrl BOOLEAN,
  option1 VARCHAR(255),
  option1IsUrl BOOLEAN,
  option2 VARCHAR(255),
  option2IsUrl BOOLEAN,
  option3 VARCHAR(255),
  option3IsUrl BOOLEAN,
  correctOption INT(1),
  CONSTRAINT MultimediaTests_FK_Tests FOREIGN KEY (id)
  REFERENCES Tests (id)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS TestCorrections;

CREATE TABLE TestCorrections (
	id INT PRIMARY KEY AUTO_INCREMENT,
	testId INT,
	studentId INT,
	executionDate DATETIME,
	type INT,
	
	FOREIGN KEY(testId) REFERENCES Tests(id),
	FOREIGN KEY(studentId) REFERENCES Students(id)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS ReadingTestCorrections;

CREATE TABLE ReadingTestCorrections(
	id INT PRIMARY KEY,
	soundFileUrl VARCHAR(100),
	professorObservations TEXT,
	
	wordsPerMinute FLOAT,
	correctWordCount INT,
	readingPrecision FLOAT,
	readingSpeed FLOAT,
	expressiveness FLOAT,
	rhythm FLOAT,

	details TEXT,

	FOREIGN KEY(id) REFERENCES TestCorrections(id)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS MultimediaTestCorrections;

CREATE TABLE MultimediaTestCorrections(
	id INT PRIMARY KEY,
	
	optionChosen INT,
	isCorrect BOOLEAN,

	FOREIGN KEY(id) REFERENCES TestCorrections(id)
) ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS Schools;

CREATE TABLE Schools(
  id INT PRIMARY KEY AUTO_INCREMENT,
  schoolAddress VARCHAR(100),
  schoolLogoUrl VARCHAR(50),
  schoolName VARCHAR(50)
)ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS Professors;

CREATE TABLE Professors(
  id INT PRIMARY KEY AUTO_INCREMENT,
  schoolId INT,
  name VARCHAR(50),
  username VARCHAR(20),
  password VARCHAR(20),
  emailAddress VARCHAR(50),
  telephoneNumber VARCHAR(10),
  isActive BOOLEAN,
  photoUrl VARCHAR(50),

  CONSTRAINT Professors_FK_Schools FOREIGN KEY(schoolId) REFERENCES Schools(id)
)ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS Classes;

CREATE TABLE Classes(
  id INT PRIMARY KEY AUTO_INCREMENT,
  schoolId INT,
  classLevel INT(2),
  className VARCHAR(30),
  classYear VARCHAR(10),

  CONSTRAINT Classes_FK_Schools FOREIGN KEY(schoolId) REFERENCES Schools(id)
)ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS Students;

CREATE TABLE Students( 
  id INT PRIMARY KEY AUTO_INCREMENT,
  classId INT,
  name VARCHAR(50),
  photoUrl VARCHAR(50),
  isActive BOOLEAN,

  CONSTRAINT Students_FK_Classes FOREIGN KEY(classId) REFERENCES Classes(id)
)ENGINE = INNODB DEFAULT CHARSET = UTF8;

DROP TABLE IF EXISTS ProfessorClass;

CREATE TABLE ProfessorClass(
  classId INT,
  professorId INT,

  PRIMARY KEY(classId, professorId),
  CONSTRAINT ProfessorClass_FK_Classes FOREIGN KEY(classId) REFERENCES Classes(id),
  CONSTRAINT ProfessorClass_FK_Professors FOREIGN KEY(professorId) REFERENCES Professors(id)
)ENGINE = INNODB DEFAULT CHARSET = UTF8;

INSERT INTO `Areas` (`id`, `description`) VALUES (1, 'Português');

INSERT INTO `Tests` (`id`,`areaId`,`professorId`,`title`,`mainText`,`grade`, `type`) VALUES (1,1,1,'Lorem Ipsum 1','Lorem ipsum dolor sit amet, consectetur adipiscing elit.',1, 0);
INSERT INTO `Tests` (`id`,`areaId`,`professorId`,`title`,`mainText`,`grade`, `type`) VALUES (2,1,1,'Lorem Ipsum 2','Lorem ipsum dolor sit amet, consectetur adipiscing elit.',2, 1);
INSERT INTO `Tests` (`id`,`areaId`,`professorId`,`title`,`mainText`,`grade`, `type`) VALUES (3,1,1,'Lorem Ipsum 3','Lorem ipsum dolor sit amet, consectetur adipiscing elit.',1, 1);
INSERT INTO `Tests` (`id`,`areaId`,`professorId`,`title`,`mainText`,`grade`, `type`) VALUES (4,1,1,'Lorem Ipsum 4','Lorem ipsum dolor sit amet, consectetur adipiscing elit.',2, 0);

INSERT INTO `MultimediaTests` (`id`,`questionContent`,`contentIsUrl`,`option1`,`option1IsUrl`,`option2`,`option2IsUrl`,`option3`,`option3IsUrl`,`correctOption`) VALUES (2,'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',0,'a',0,'b',0,'c',0,1);
INSERT INTO `MultimediaTests` (`id`,`questionContent`,`contentIsUrl`,`option1`,`option1IsUrl`,`option2`,`option2IsUrl`,`option3`,`option3IsUrl`,`correctOption`) VALUES (3,'Aenean in velit sodales, tempor erat id, egestas sapien.',0,'d',0,'e',0,'c',0,2);

INSERT INTO `ReadingTests` (`id`,`textContent`,`professorAudioUrl`) VALUES (1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed egestas nisl non massa ultricies aliquet. Aliquam placerat mauris ut massa ultrices, eu vehicula justo ornare. Proin nec sodales urna, ut cursus augue. Ut eu enim adipiscing, tempor odio sit amet, venenatis ligula. Nulla non sodales tortor. Curabitur sed orci vitae lectus elementum venenatis. Vestibulum volutpat dignissim lacus ut porttitor. Morbi nec libero dictum, tincidunt mi pharetra, aliquam erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.\\n\\nAenean in velit sodales, tempor erat id, egestas sapien. Nam mauris libero, bibendum et aliquam at, pretium eu nunc. Aenean vestibulum tincidunt orci, id ullamcorper nulla facilisis a. Aenean sed magna tempus, ultricies velit vel, blandit lacus. Nam sed mi non ligula consectetur lacinia commodo nec turpis. Aliquam eget rhoncus augue. Pellentesque et libero adipiscing, venenatis justo quis, suscipit urna. Nullam convallis pharetra orci, vitae varius velit rhoncus quis. Sed facilisis auctor nisl at dapibus.','\'\'');
INSERT INTO `ReadingTests` (`id`,`textContent`,`professorAudioUrl`) VALUES (4,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed egestas nisl non massa ultricies aliquet. Aliquam placerat mauris ut massa ultrices, eu vehicula justo ornare. Proin nec sodales urna, ut cursus augue. Ut eu enim adipiscing, tempor odio sit amet, venenatis ligula. Nulla non sodales tortor. Curabitur sed orci vitae lectus elementum venenatis. Vestibulum volutpat dignissim lacus ut porttitor. Morbi nec libero dictum, tincidunt mi pharetra, aliquam erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.\\n\\nAenean in velit sodales, tempor erat id, egestas sapien. Nam mauris libero, bibendum et aliquam at, pretium eu nunc. Aenean vestibulum tincidunt orci, id ullamcorper nulla facilisis a. Aenean sed magna tempus, ultricies velit vel, blandit lacus. Nam sed mi non ligula consectetur lacinia commodo nec turpis. Aliquam eget rhoncus augue. Pellentesque et libero adipiscing, venenatis justo quis, suscipit urna. Nullam convallis pharetra orci, vitae varius velit rhoncus quis. Sed facilisis auctor nisl at dapibus.','\'\'');

INSERT INTO `Schools` (`id`,`schoolAddress`,`schoolLogoUrl`,`schoolName`) VALUES (1,'Endereço 1','appContent/schools/school-1/logo.jpg','Escola 1');
INSERT INTO `Schools` (`id`,`schoolAddress`,`schoolLogoUrl`,`schoolName`) VALUES (2,'Endereço 2','appContent/schools/school-2/logo.jpg','Escola 2');
INSERT INTO `Schools` (`id`,`schoolAddress`,`schoolLogoUrl`,`schoolName`) VALUES (3,'Endereço 3','appContent/schools/school-3/logo.jpg','Escola 3');

INSERT INTO `Professors` (`id`,`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES (1,1,'Professor 1','prof1','prof1','prof1@letrinhas.ipt.pt','249000001',1,'appContent/professors/professor-1/picture.jpg');
INSERT INTO `Professors` (`id`,`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES (2,2,'Professor 2','prof2','prof2','prof2@letrinhas.ipt.pt','249000002',1,'appContent/professors/professor-2/picture.jpg');
INSERT INTO `Professors` (`id`,`schoolId`,`name`,`username`,`password`,`emailAddress`,`telephoneNumber`,`isActive`,`photoUrl`) VALUES (3,3,'Professor 3','prof3','prof3','prof3@letrinhas.ipt.pt','249000003',1,'appContent/professors/professor-3/picture.jpg');

INSERT INTO `Classes` (`id`,`schoolId`,`classLevel`,`className`,`classYear`) VALUES (1,1,1,'A','2013-2014');
INSERT INTO `Classes` (`id`,`schoolId`,`classLevel`,`className`,`classYear`) VALUES (2,1,2,'A','2012-2013');
INSERT INTO `Classes` (`id`,`schoolId`,`classLevel`,`className`,`classYear`) VALUES (3,2,1,'B','2010-2011');
INSERT INTO `Classes` (`id`,`schoolId`,`classLevel`,`className`,`classYear`) VALUES (4,3,1,'C','2013-2014');

INSERT INTO `ProfessorClass` (`classId`,`professorId`) VALUES (1,1);
INSERT INTO `ProfessorClass` (`classId`,`professorId`) VALUES (2,1);
INSERT INTO `ProfessorClass` (`classId`,`professorId`) VALUES (3,2);
INSERT INTO `ProfessorClass` (`classId`,`professorId`) VALUES (4,3);

INSERT INTO `Students` (`id`,`classId`,`name`,`photoUrl`,`isActive`) VALUES (1,1,'Aluno 1','appContent/students/student-1/picture.jpg',1);
INSERT INTO `Students` (`id`,`classId`,`name`,`photoUrl`,`isActive`) VALUES (2,2,'Aluno 2','appContent/students/student-2/picture.jpg',1);
INSERT INTO `Students` (`id`,`classId`,`name`,`photoUrl`,`isActive`) VALUES (3,3,'Aluno 3','appContent/students/student-3/picture.jpg',1);
INSERT INTO `Students` (`id`,`classId`,`name`,`photoUrl`,`isActive`) VALUES (4,4,'Aluno 4','appContent/students/student-4/picture.jpg',1);

SET foreign_key_checks = 1;