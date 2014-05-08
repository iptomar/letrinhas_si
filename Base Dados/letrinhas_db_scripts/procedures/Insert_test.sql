delimiter $$

drop procedure if exists insertReadingTest $$

create procedure insertReadingTest(in areaId int, in professorId int,
								   in title varchar(50), in mainText varchar(80),
								   in creationDate int, in grade int(1), in type int,
								   textContent text, professorAudioUrl varchar(100))
BEGIN
	declare continue handler for sqlexception
		begin
			rollback;
			signal sqlstate '45000' set message_text = 'Erro!!!';
		end;

	-- Start a transaction
	start transaction;

	-- Insert common data.
	insert into Tests(areaId, professorId, title, mainText, creationDate, grade, type) VALUES
				(areaid, professorId, title, mainText, from_unixtime(creationDate), grade, type);
	
	#select last_insert_id();


	-- Insert reading test data.
	insert into ReadingTests (id, textContent, professorAudioUrl) VALUES 
	(last_insert_id(), textContent, professorAudioUrl);

	-- Commit.
	commit;
end $$

delimiter ;

#call insertReadingTest(1, 1, 'titulo', 'text', unix_timestamp(), 1, 0, 'conteúdo', 'url');