delimiter $$

drop procedure if exists insertReadingTest $$

create procedure insertReadingTest(in areaId int, in professorId int,
                   in title varchar(50), in mainText varchar(80),
                   in creationDate bigint, in grade int(1), in type int,
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
    (areaid, professorId, title, mainText, creationDate, grade, type);
  
  #select last_insert_id();


  -- Insert reading test data.
  insert into ReadingTests (id, textContent, professorAudioUrl) VALUES 
    (last_insert_id(), textContent, professorAudioUrl);

  -- Commit.
  commit;
end $$

drop procedure if exists insertMultimediaTest $$

create procedure insertMultimediaTest(
  in areaId int, in professorId int,
  in title varchar(50), in mainText varchar(80),
  in creationDate bigint, in grade int(1), in type int,
  in questionContent varchar(255), in contentIsUrl boolean,
  in option1 varchar(255), in option1IsUrl boolean,
  in option2 varchar(255), in option2IsUrl boolean,
  in option3 varchar(255), in option3IsUrl boolean,
  in correctOption int
)

begin
  declare continue handler for sqlexception
    #begin
    #  rollback;
    #  signal sqlstate '45000' set message_text = 'Erro!!!';
    #end;

  -- Start a transaction
  start transaction;

  -- Insert common data.
  insert into Tests
    (areaId, professorId, title, mainText, creationDate, grade, type) VALUES
    (areaid, professorId, title, mainText, creationDate, grade, 1);

  insert into MultimediaTests (id, questionContent, contentIsUrl,
    option1, option1IsUrl, option2, option2IsUrl, option3, option3IsUrl,
    correctOption) VALUES 
    (last_insert_id(), questionContent, contentIsUrl,
    option1, option1IsUrl,
    option2, option2IsUrl,
    option3, option3IsUrl,
    correctOption
  );

  commit;


end $$

delimiter ;

#call insertReadingTest(1, 1, 'titulo', 'text', unix_timestamp(), 1, 0, 'conteúdo', 'url');