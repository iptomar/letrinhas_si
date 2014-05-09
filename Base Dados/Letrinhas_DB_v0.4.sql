# Base de Dados : 'Letrinhas'
# P.S.I 2014
#

# --------------------------------------------------------

# Criação das tabelas em formato InnoDB

# --------------------------------------------------------
# tabela 1
# Estrutura da tabela 'tbl_Escola'

CREATE TABLE tbl_Escola (
  idEscola int NOT NULL AUTO_INCREMENT,
  nome varchar (50) NOT NULL,
  logotipo MEDIUMBLOB NOT NULL,
  morada varchar (50) NOT NULL,
  criacao timestamp default current_timestamp(),
  PRIMARY KEY (idEscola)
) TYPE=InnoDB DEFAULT CHARSET=utf-8;


# --------------------------------------------------------
# tabela 2
# Estrutura da tabela 'tbl_Professor'

CREATE TABLE tbl_Professor (
  idProfessor int NOT NULL AUTO_INCREMENT ,
  userName varchar (20) NOT NULL,
  password varchar (10) NOT NULL,
  nome varchar (30) NOT NULL,
  telefone varchar (9) NOT NULL,
  email varchar (40) NOT NULL,
  foto MEDIUMBLOB NOT NULL,
  estado_atividade varchar (1) NOT NULL,
  criacao timestamp default current_timestamp(),
  PRIMARY KEY (idProfessor)
  FOREIGN KEY (idEscola)
     REFERENCES tbl_Escola(idEscola)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;

# --------------------------------------------------------
# tabela 3
# Estrutura da tabela 'tbl_Turma'

CREATE TABLE tbl_Turma  (
  idTurma int NOT NULL AUTO_INCREMENT,
  ano int (1) NOT NULL,
  nome varchar (10) NOT NULL,
  ano_letivo varchar (9) NOT NULL,
  criacao timestamp default current_timestamp(),
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
  idAluno int NOT NULL AUTO_INCREMENT,
  nome varchar (30) NOT NULL,
  foto MEDIUMBLOB NOT NULL,
  estado varchar (1) NOT NULL,
  criacao timestamp default current_timestamp(),
  PRIMARY KEY (idAluno)
  FOREIGN KEY (idTurma)
     REFERENCES tbl_Turma(idTurma)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;

# --------------------------------------------------------
# tabela 6
# Estrutura da tabela 'tbl_Teste'

CREATE TABLE tbl_Teste (
  idTeste int NOT NULL AUTO_INCREMENT,
  dataTeste date NOT NULL,
  grau int NOT NULL,
  criacao timestamp default current_timestamp(),
  PRIMARY KEY (idTeste),
  FOREIGN KEY (idProfessor)
     REFERENCES tbl_Professor(idProfessor)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;



# --------------------------------------------------------
# tabela 7
# Estrutura da tabela 'tbl_TesteLeitura'

CREATE TABLE tbl_TesteLeitura (
  texto varchar(300) NOT NULL,
  somProfessor MEDIUMBLOB NOT NULL,
  criacao timestamp default current_timestamp(),
  PRIMARY KEY (idTeste),
  FOREIGN KEY (idTeste)
     REFERENCES tbl_Teste(idTeste)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;


# --------------------------------------------------------
# tabela 8
# Estrutura da tabela 'tbl_Teste_Multimedia'

CREATE TABLE tbl_Teste_Multimedia (
  pergunta MEDIUMBLOB NOT NULL,
  hipotese1 MEDIUMBLOB NOT NULL,
  hipotese2 MEDIUMBLOB NOT NULL,
  hipotese3 MEDIUMBLOB NOT NULL,
  hipoteseCorreta MEDIUMBLOB NOT NULL,
  criacao timestamp default current_timestamp(),
  FOREIGN KEY (idTeste)
     REFERENCES tbl_Teste(idTeste)
     ON UPDATE CASCADE ON DELETE CASCADE,
) TYPE=InnoDB DEFAULT CHARSET=utf-8;

# --------------------------------------------------------
# tabela 9
# Estrutura da tabela 'tbl_Correcao_teste'

CREATE TABLE tbl_Correcao_Teste (
  idCorrecao int NOT NULL AUTO_INCREMENT,
  idTeste int NOT NULL,
  idAluno int NOT NULL,
  dataExecucao Time NOT NULL,
  criacao timestamp default current_timestamp(),
  PRIMARY KEY (idCorrecao,idTeste,idAluno),
  FOREIGN KEY (idTeste)
     REFERENCES tbl_Teste(idTeste)
     ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (idAluno)
     REFERENCES tbl_Aluno(idAluno)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;


# --------------------------------------------------------
# tabela 10
# Estrutura da tabela 'tbl_Correcao_multimedia'

CREATE TABLE tbl_Correcao_Multimedia (
  idCorrecao int NOT NULL AUTO_INCREMENT,
  opcaoAluno MEDIUMBLOB NOT NULL,
  criacao timestamp default current_timestamp(),
  PRIMARY KEY (idCorrecao),
  FOREIGN KEY (idCorrecao)
     REFERENCES tbl_Correcao_Teste(idCorrecao)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;

# --------------------------------------------------------
# tabela 11
# Estrutura da tabela 'tbl_Correcao'

CREATE TABLE tbl_Correcao_Leitura (
  idCorrecao int NOT NULL AUTO_INCREMENT,
  som MEDIUMBLOB NOT NULL,
  observacoes varchar(70) NOT NULL,
  classificacao int (3),
  PLM int (10),
  PCL int (10),
  PL int (10),
  VL int (10),
  expressividade int (10),
  ritmo int (10),
  detalhes varchar (255),
  criacao timestamp default current_timestamp(),
  PRIMARY KEY (idCorrecao),
  FOREIGN KEY (idTeste)
     REFERENCES tbl_Teste(idTeste)
     ON UPDATE CASCADE ON DELETE CASCADE
) TYPE=InnoDB DEFAULT CHARSET=utf-8;