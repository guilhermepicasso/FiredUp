create database FiredUp;

use FiredUp;

-- Criação da tabela StatusReserva
CREATE TABLE StatusReserva (
    idStatus INT AUTO_INCREMENT PRIMARY KEY,
    NomeStatus VARCHAR(50) NOT NULL
);

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
    Resgras VARCHAR(1000)
);

-- Criação da tabela Item
CREATE TABLE Item (
    idItem INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    QtdTotal INT NOT NULL,
    QtdDisponivel INT NOT NULL
);

-- Criação da tabela EspacoDisponibilidade
CREATE TABLE DisponibilidadeEspaco (
    idDisponibilidade INT AUTO_INCREMENT PRIMARY KEY,
    idEspaco INT NOT NULL,
    DiaSemana VARCHAR(20) NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFim TIME NOT NULL,
    FOREIGN KEY (idEspaco) REFERENCES Espaco(idEspaco) ON DELETE CASCADE
);

-- Criação da tabela ItemEspaco (para relacionar os itens com os espaços)
CREATE TABLE ItemEspaco (
    idItemEspaco INT AUTO_INCREMENT PRIMARY KEY,
    idItem INT NOT NULL,
    idEspaco INT NOT NULL,
    FOREIGN KEY (idItem) REFERENCES Item(idItem) ON DELETE CASCADE,
    FOREIGN KEY (idEspaco) REFERENCES Espaco(idEspaco) ON DELETE CASCADE
);

-- Tabela ModalidadeEspaco (relacionamento entre modalidades e espaços)
CREATE TABLE ModalidadeEspaco (
    idModalidadeEspaco INT AUTO_INCREMENT PRIMARY KEY,
    idModalidade INT NOT NULL,
    idEspaco INT NOT NULL,
    FOREIGN KEY (idModalidade) REFERENCES Modalidade(idModalidade) ON DELETE CASCADE,
    FOREIGN KEY (idEspaco) REFERENCES Espaco(idEspaco) ON DELETE CASCADE
);

-- Criação da tabela Equipe
CREATE TABLE Equipe (
    idEquipe INT AUTO_INCREMENT PRIMARY KEY,
    NomeEquipe VARCHAR(100) NOT NULL,
    isPublica BOOLEAN NOT NULL,
    idResponsavel INT NOT NULL, -- Referencia ao responsável pela equipe
    idModalidade INT NOT NULL,
    FOREIGN KEY (idModalidade) REFERENCES Modalidade(idModalidade) ON DELETE CASCADE
);

-- Criação da tabela EquipeParticipantes (relacionamento entre equipe e participantes)
CREATE TABLE Participantes (
    idParticipante INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idEquipe INT NOT NULL,
    DataEntrada DATE NOT NULL,
    FOREIGN KEY (idEquipe) REFERENCES Equipe(idEquipe) ON DELETE CASCADE
);

-- Criação da tabela Reserva
CREATE TABLE Reserva (
    idReserva INT AUTO_INCREMENT PRIMARY KEY,
    DataReserva DATETIME NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFim TIME NOT NULL,
    idEspaco INT NOT NULL,
    idResponsavel INT, -- Pode ser nulo, caso a reserva seja feita por Equipe
    idEquipe INT, -- Pode ser nulo, caso a reserva seja feita individualmente
    idStatus INT NOT NULL,
    idAdmResponsavel INT NOT NULL, -- Referencia ao administrador que autorizou
    FOREIGN KEY (idEspaco) REFERENCES Espaco(idEspaco) ON DELETE CASCADE,
    FOREIGN KEY (idEquipe) REFERENCES Equipe(idEquipe) ON DELETE SET NULL,
    FOREIGN KEY (idStatus) REFERENCES StatusReserva(idStatus)
);


