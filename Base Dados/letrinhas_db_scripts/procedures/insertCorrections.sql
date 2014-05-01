delimiter $$

drop procedure if exists insertReadingTestCorrection $$

create procedure insertReadingTestCorrection(in testId int, in studentId int, in executionDate int,
								   soundFileUrl varchar(100), professorObservations text,
								   wordsPerMinute float, correctWordCount int, 
								   readingPrecision float, readingSpeed float,
								   expressiveness float, rhythm float, details text)
BEGIN
	declare continue handler for sqlexception
		begin
			rollback;
			signal sqlstate '45000' set message_text = 'Unable to insert data.';
		end;

	-- Start a transaction
	start transaction;

	-- Insert common data.
	insert into TestCorrections(testId, studentId, executionDate, type) VALUES
				(testId, studentId, from_unixtime(executionDate), 0);

	-- Insert reading test data.
	insert into ReadingTestCorrections VALUES (last_insert_id(), soundFileUrl, professorObservations,
											   wordsPerMinute, correctWordCount, readingPrecision,
											   readingSpeed, expressiveness, rhythm, details);

	-- Commit.
	commit;
end $$

delimiter ;

call insertReadingTestCorrection(1, 1, 1234, '', '', 1.0, 1, 1.0, 1.0, 1.0, 1.0, '');

delimiter $$

drop procedure if exists insertMultimediaTestCorrection $$

create procedure insertMultimediaTestCorrection(in testId int, in studentId int, in executionDate int,
												in optionChosen int, in isCorrect BOOLEAN)
BEGIN
	declare continue handler for sqlexception
		begin
			rollback;
			signal sqlstate '45000' set message_text = 'Unable to insert data.';
		end;

	-- Start a transaction
	start transaction;

	-- Insert common data.
	insert into TestCorrections(testId, studentId, executionDate, type) VALUES
				(testId, studentId, from_unixtime(executionDate), 1);

	-- Insert reading test data.
	insert into MultimediaTestCorrections VALUES (last_insert_id(), optionChosen, isCorrect);

	-- Commit.
	commit;
end $$

delimiter ;

call insertMultimediaTestCorrection(1, 1, 1234, 1, 0);

