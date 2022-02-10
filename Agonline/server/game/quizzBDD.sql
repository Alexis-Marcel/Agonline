-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 09 fév. 2022 à 13:28
-- Version du serveur : 10.4.21-MariaDB
-- Version de PHP : 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `quizz`
--

-- --------------------------------------------------------

--
-- Structure de la table `question`
--

CREATE TABLE `question` (
  `QuestionID` int(11) NOT NULL,
  `Question` varchar(100) NOT NULL,
  `ReponseA` varchar(50) NOT NULL,
  `ReponseB` varchar(50) NOT NULL,
  `ReponseC` varchar(50) NOT NULL,
  `ReponseD` varchar(50) NOT NULL,
  `BonneReponse` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `question`
--

INSERT INTO `question` (`QuestionID`, `Question`, `ReponseA`, `ReponseB`, `ReponseC`, `ReponseD`, `BonneReponse`) VALUES
(1, 'Quelle est la capitale de l\'ouzbekistan ?', 'Khartoum', 'Addis-Abeba', 'Noursoultan', 'Tachkent', 'D'),
(2, 'Quelle est la capital de la Colombie ?', 'La Havane', 'Bogota', 'Nairobi', 'Helsinki', 'B'),
(3, 'Quelle est la capital de l\'Indonésie ?', 'Buenos Aires', 'Jakarta', 'Manille', 'Oulan-Bator', 'B');

-- --------------------------------------------------------

--
-- Structure de la table `quizz`
--

CREATE TABLE `quizz` (
  `ID` int(5) NOT NULL,
  `Categorie` varchar(50) NOT NULL,
  `QuestionID` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `quizz`
--

INSERT INTO `quizz` (`ID`, `Categorie`, `QuestionID`) VALUES
(1, 'Géographie', 1),
(2, 'Géographie', 2),
(3, 'Géographie', 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`QuestionID`);

--
-- Index pour la table `quizz`
--
ALTER TABLE `quizz`
  ADD PRIMARY KEY (`ID`,`Categorie`),
  ADD KEY `fk_foreign_QuestionID` (`QuestionID`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `question`
--
ALTER TABLE `question`
  MODIFY `QuestionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `quizz`
--
ALTER TABLE `quizz`
  MODIFY `ID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `quizz`
--
ALTER TABLE `quizz`
  ADD CONSTRAINT `fk_foreign_QuestionID` FOREIGN KEY (`QuestionID`) REFERENCES `question` (`QuestionID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
