SELECT t.id, t.type, t.professorId, t.title, t.mainText, UNIX_TIMESTAMP(t.creationDate) AS creationDate, 
	   t.grade, t.areaId, mt.option1, mt.option1IsUrl, mt.option2, mt.option2IsUrl, 
	   mt.option3, mt.option3IsUrl, mt.correctOption
FROM Tests AS t
JOIN MultimediaTests AS mt ON mt.id = t.id
WHERE t.type = 1;