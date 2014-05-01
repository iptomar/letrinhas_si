select t.id, t.professorId, t.title, t.mainText, unix_timestamp(t.creationDate) as creationDate, t.grade, t.areaId, rt.professorAudioUrl, rt.textContent
from Tests as t
join ReadingTests as rt on rt.id = t.id
where t.type = 0;