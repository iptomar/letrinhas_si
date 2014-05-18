delimiter $$

drop procedure if exists insertReadingTestCorrection $$

create procedure insertReadingTestCorrection(
  in testId int, in studentId int, in executionDate int,
  in soundFileUrl varchar(100), in professorObservations text,
  in wordsPerMinute float, in correctWordCount int, 
  in readingPrecision float, in readingSpeed float,
  in expressiveness float, in rhythm float, in details text, 
  in wasCorrected BOOLEAN, in type int
)
BEGIN
  declare continue handler for sqlexception
    begin
      rollback;
      signal sqlstate '45000' set message_text = 'Unable to insert data.';
    end;

  -- Start a transaction
  start transaction;

  -- Check if we already have data for the current test.
  if (select count(*) from TestCorrections as tc
                      where tc.testId = testId and
                            tc.studentId = studentId and
                            tc.executionDate = executionDate) = 0 then
    -- Submission doesn't exist.
    -- Insert common data.
    insert into TestCorrections(testId, studentId, executionDate, type) VALUES (
      testId, studentId, executionDate, type
    );

    -- Insert reading test data.
    insert into ReadingTestCorrections VALUES (
      testId, studentId, executionDate, soundFileUrl, 
      professorObservations, wordsPerMinute, correctWordCount, 
      readingPrecision, readingSpeed, expressiveness, 
      rhythm, details, wasCorrected
    );
  else
    -- Submission already exists. Update instead.
    update ReadingTestCorrections as rtc
      set rtc.professorObservations = professorObservations,
          rtc.wordsPerMinute = wordsPerMinute,
          rtc.correctWordCount = correctWordCount,
          rtc.readingPrecision = readingPrecision,
          rtc.rhythm = rhythm,
          rtc.details = details,
          rtc.wasCorrected = wasCorrected
      where rtc.testId = testId and 
            rtc.studentId = studentId and 
            rtc.executionDate = executionDate;
  end if;

  -- Commit.
  commit;
end $$

delimiter ;

-- call insertReadingTestCorrection(1, 1, 1234, 'url', 'obs', 1.0, 1, 1.0, 1.0, 1.0, 1.0, 'details', 0, 1);

delimiter $$

drop procedure if exists insertMultimediaTestCorrection $$

create procedure insertMultimediaTestCorrection(
  in testId int, in studentId int, in executionDate int,
  in optionChosen int, in isCorrect BOOLEAN
)
BEGIN
  declare continue handler for sqlexception
    begin
      rollback;
      signal sqlstate '45000' set message_text = 'Unable to insert data.';
    end;

  -- Start a transaction
  start transaction;

  -- Insert common data.
  insert into TestCorrections(testId, studentId, executionDate, type) VALUES (
    testId, studentId, from_unixtime(executionDate), 1
  );

  -- Insert reading test data.
  insert into MultimediaTestCorrections VALUES 
    (last_insert_id(), optionChosen, isCorrect);

  -- Commit.
  commit;
end $$

delimiter ;

-- call insertMultimediaTestCorrection(1, 1, 1234, 1, 0);

