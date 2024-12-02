create database FiredUp;

use FiredUp;

-- Criação da tabela Modalidade
CREATE TABLE Modalidade (
    idModalidade INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Foto VARCHAR(255)
);

-- Criação da tabela Espaco
CREATE TABLE Espaco (
    idEspaco INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Foto VARCHAR(255),
    Regras VARCHAR(1000)
);

-- Criação da tabela Item
CREATE TABLE Item (
    idItem INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    QtdTotal INT NOT NULL,
    QtdDisponivel INT NOT NULL
);

-- Teste de criação de horario de funcionamento do espaço com ENUM
CREATE TABLE HorarioFuncionamento (
    idHorarioFuncionamento INT AUTO_INCREMENT PRIMARY KEY,
    idEspaco INT NOT NULL,
    diaSemana ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo') NOT NULL,
    horaInicio TIME NOT NULL,
    horaFim TIME NOT NULL,
    FOREIGN KEY (idEspaco) REFERENCES Espaco(idEspaco) ON DELETE CASCADE
);

SHOW VARIABLES LIKE 'sql_mode';
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION';

-- Criação da tabela ItemEspaco (para relacionar os itens com os espaços)
CREATE TABLE ItemEspaco (
    idItemEspaco INT AUTO_INCREMENT PRIMARY KEY,
    idItem INT NOT NULL,
    idEspaco INT NOT NULL,
    FOREIGN KEY (idItem) REFERENCES Item(idItem) ON DELETE CASCADE,
    FOREIGN KEY (idEspaco) REFERENCES Espaco(idEspaco) ON DELETE CASCADE,
    CONSTRAINT UNQ_ItemEspaco UNIQUE (idItem, idEspaco)  -- Garantir que não haja duplicatas
);

-- Tabela ModalidadeEspaco (relacionamento entre modalidades e espaços)
CREATE TABLE ModalidadeEspaco (
    idModalidadeEspaco INT AUTO_INCREMENT PRIMARY KEY,
    idModalidade INT NOT NULL,
    idEspaco INT NOT NULL,
    FOREIGN KEY (idModalidade) REFERENCES Modalidade(idModalidade) ON DELETE CASCADE,
    FOREIGN KEY (idEspaco) REFERENCES Espaco(idEspaco) ON DELETE CASCADE,
    CONSTRAINT UNQ_ModalidadeEspaco UNIQUE (idModalidade, idEspaco)
);

-- Criação da tabela Equipe
CREATE TABLE Equipe (
    idEquipe INT AUTO_INCREMENT PRIMARY KEY,
    NomeEquipe VARCHAR(100) NOT NULL,
    isPublica BOOLEAN NOT NULL,
    idResponsavel INT NOT NULL, -- Referencia ao responsável pela equipe
    QtdMaxima INT NOT NULL,
    idModalidade INT NOT NULL,
    FOREIGN KEY (idModalidade) REFERENCES Modalidade(idModalidade) ON DELETE CASCADE
);

-- Criação da tabela EquipeParticipantes (relacionamento entre equipe e participantes)
CREATE TABLE Participante (
    idParticipante INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idEquipe INT NOT NULL,
    DataEntrada DATE NOT NULL,
    FOREIGN KEY (idEquipe) REFERENCES Equipe(idEquipe) ON DELETE CASCADE,
    CONSTRAINT UNQ_UserEquipe UNIQUE (idUsuario, idEquipe)
);

-- Criação da tabela Reserva
CREATE TABLE Reserva (
    idReserva INT AUTO_INCREMENT PRIMARY KEY,
    DataReserva DATETIME NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFim TIME NOT NULL,
    idEspaco INT NOT NULL,
    idEquipe INT, -- Pode ser nulo, caso a reserva seja feita individualmente
    status bool NOT NULL,
    idAdmResponsavel INT NOT NULL, -- Referência ao administrador que autorizou
    FOREIGN KEY (idEspaco) REFERENCES Espaco(idEspaco) ON DELETE CASCADE,
    FOREIGN KEY (idEquipe) REFERENCES Equipe(idEquipe) ON DELETE CASCADE
);
