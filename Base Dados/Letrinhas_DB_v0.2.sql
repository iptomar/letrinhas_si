 
# Base de Dados : 'Letrinhas'
# P.S.I 2014
#

# --------------------------------------------------------

# Criação das tabelas em formato InnoDB

# --------------------------------------------------------
# tabela 1
# Estrutura da tabela 'tbl_Escola'

CREATE TABLE tbl_Escola (
  idEscola int NOT NULL ,
  nome varchar (50) NOT NULL,
  logotipo varbinary (max) NOT NULL,
  morada varchar (50) NOT NULL,
  PRIMARY KEY (idEscola)
) TYPE=InnoDB DEFAULT CHARSET=utf-8;


# --------------------------------------------------------
# tabela 2
# Estrutura da tabela 'tbl_Professor'

CREATE TABLE tbl_Professor (
  idProfessor int NOT NULL ,
  userName varchar (20) NOT NULL,
  password varchar (10) NOT NULL,
  nome varchar (30) NOT NULL,
  telefone varchar (9) NOT NULL,
  email varchar (40) NOT NULL,
  foto varbinary (max) NOT NULL,
  estado_atividade varchar (1) NOT NULL,
  PRIMARY KEY (idProfessor)
  FOREIGN KEY (idEscola)
     REFERENCES tbl_Escola(idEscola)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;

# --------------------------------------------------------
# tabela 3
# Estrutura da tabela 'tbl_Turma'

CREATE TABLE tbl_Turma (
  idTurma int NOT NULL ,
  ano int (1) NOT NULL,
  nome varchar (10) NOT NULL,
  ano_letivo varchar (9) NOT NULL,
  PRIMARY KEY (idTurma)
  FOREIGN KEY (idEscola)
     REFERENCES tbl_Escola(idEscola)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;

#-----------------------------------------------------
#TABELA TURMA_PROFESSOR
#
# --------------------------------------------------------
# tabela 4
# Estrutura da tabela 'tbl_Turma_Professor'

CREATE TABLE tbl_Turma_Professor (
  idTurma int NOT NULL,
  idProfessor int NOT NULL,
  PRIMARY KEY (idTurma),
  FOREIGN KEY (idTurma)
     REFERENCES tbl_Turma(idTurma)
     ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (idProfessor)
     REFERENCES tbl_Professor(idProfessor)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;


# --------------------------------------------------------
# tabela 5
# Estrutura da tabela 'tbl_Aluno'

CREATE TABLE tbl_Aluno(
  idAluno int NOT NULL ,
  nome varchar (30) NOT NULL,
  foto varbinary (max) NOT NULL,
  estado varchar (1) NOT NULL,
  PRIMARY KEY (idAluno)
  FOREIGN KEY (idTurma)
     REFERENCES tbl_Turma(idTurma)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;

# --------------------------------------------------------
# tabela 6
# Estrutura da tabela 'tbl_Teste'

CREATE TABLE tbl_Teste (
  idTeste int NOT NULL,
  dataTeste date NOT NULL,
  PRIMARY KEY (idTeste),
  FOREIGN KEY (idProfessor)
     REFERENCES tbl_Professor(idProfessor)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;


# --------------------------------------------------------
# tabela 7
# Estrutura da tabela 'tbl_Correcao'

CREATE TABLE tbl_Correcao (
  idCorrecao int NOT NULL,
  som varbinary(max) NOT NULL,
  observacoes varchar(70) NOT NULL,
  classificacao int (3),
  PLM int (10),
  PCL int (10),
  PL int (10),
  VL int (10),
  expressividade int (10),
  ritmo int (10),
  PRIMARY KEY (idCorrecao),
  FOREIGN KEY (idTeste)
     REFERENCES tbl_Teste(idTeste)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;


# --------------------------------------------------------
# tabela 7
# Estrutura da tabela 'tbl_TesteLeitura'

CREATE TABLE tbl_TesteLeitura (
  texto varchar(300) NOT NULL,
  somProfessor varbinary(max) NOT NULL,
  tempo time(7) NOT NULL,
  FOREIGN KEY (idTeste)
     REFERENCES tbl_Teste(idTeste)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;


# --------------------------------------------------------
# tabela 8
# Estrutura da tabela 'tbl_EscolhaMultipla'

CREATE TABLE tbl_EscolhaMultipla (
  texto varchar (200) NOT NULL,
  imagem1 MEDIUMBLOB NOT NULL,
  imagem2 MEDIUMBLOB NOT NULL,
  imagem3 MEDIUMBLOB NOT NULL,
  opcaoCorreta int(1) NOT NULL,
  FOREIGN KEY (idTeste)
     REFERENCES tbl_Teste(idTeste)
     ON UPDATE CASCADE ON DELETE CASCADE,
) TYPE=InnoDB DEFAULT CHARSET=utf-8;
