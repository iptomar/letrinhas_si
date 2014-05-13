delimiter $$

DROP PROCEDURE IF EXISTS getTestById $$

CREATE PROCEDURE getTestById(IN testId INT)
BEGIN
	DECLARE testType INT(1);

	SET testType = (SELECT `type` FROM Tests WHERE testId = id);

	
		CASE testType
			WHEN 0 THEN SELECT t.id, t.type, t.professorId, t.title, t.mainText, UNIX_TIMESTAMP(t.creationDate) AS creationDate, 
							   t.grade, t.areaId, rt.professorAudioUrl, rt.textContent
						FROM Tests AS t
						JOIN ReadingTests AS rt ON rt.id = t.id
						WHERE t.id = testId;
			WHEN 1 THEN SELECT t.id, t.type, t.professorId, t.title, t.mainText, UNIX_TIMESTAMP(t.creationDate) AS creationDate, 
							   t.grade, t.areaId, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, 
							   mt.option3, mt.option3IsUrl, mt.correctOption, mt.questionContent, mt.contentIsUrl
						FROM Tests AS t
						JOIN MultimediaTests AS mt ON mt.id = t.id
						WHERE t.id = testId;
			-- This allows us to be selective with the types.
			-- If a new one comes along, just add a case here!
			ELSE
				-- SQLSTATE 45000 means 'User-defined exception.'
				-- SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No such test.';
				SELECT NULL LIMIT 0;
		END CASE;
END $$

delimiter ;

-- Run as:
#call getTestById(3)