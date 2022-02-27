-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 27 fév. 2022 à 16:28
-- Version du serveur : 10.4.22-MariaDB
-- Version de PHP : 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `agonline`
--

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `CategorieID` int(11) NOT NULL,
  `CategorieType` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`CategorieID`, `CategorieType`) VALUES
(1, 'Geographie'),
(2, 'Sport');

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
(3, 'Quelle est la capital de l\'Indonésie ?', 'Buenos Aires', 'Jakarta', 'Manille', 'Oulan-Bator', 'B'),
(4, 'Quelle est la capitale du Brésil ?', 'Brasília', 'Rio de Janeiro', 'Buenos Aires', 'Sucre', 'A'),
(5, 'Quelle est la capitale du Canada ?', 'Montréal', 'Luanda', 'Ottawa', 'Québec', 'C'),
(6, 'Quelle est la capitale de la Mongolie ?', 'Maputo	', 'Kiev', 'Noursoultan', 'Oulan-Bator', 'D'),
(7, 'Quelle est la capitale de la Suède ?', 'Stockholm	', 'Oslo', 'Amsterdam', 'Helsinki', 'A'),
(8, 'Quelle est la capitale de la Lettonie ?', 'Vilnius', 'Tallinn', 'Riga', 'Sofia', 'C'),
(9, 'Quelle est la capitale du Danemark ?', 'Berne', 'Bruxelles', 'Bratislava', 'Copenhague', 'D'),
(10, 'Quelle est la capitale de la Chine ?', 'Tokyo', 'Pékin', 'Séoul', 'Jakarta	', 'B'),
(11, 'Quelle est la capitale du Qatar ?', 'Doha', 'Dubaï', 'La Valette', 'New Delhi	', 'A'),
(12, 'Quelle est la capitale du Pérou?', 'Minsk', 'Varsovie', 'Prague', 'Lima	', 'D'),
(13, 'Quelle est la capitale du Guatemala ?', 'Ouagadougou', 'Amsterdam	', 'Guatemala', 'Chișinău', 'C'),
(14, 'Quelle est la capitale de la Grèce ?', 'Athènes	', 'Lomé', 'Dakar', 'Abuja	', 'A'),
(15, 'Quelle est la capitale de la Sierra Leone ?', 'Sierra', 'Leone', 'Tel Aviv', 'Freetown', 'D'),
(16, 'Quelle est la capitale d\'Israel ?', 'Mascate', 'Tel Aviv', 'Gitega', 'Conakry	', 'B'),
(17, 'Quelle est la capitale de l\'Honduras ?', 'Tegucigalpa', 'Santiago', 'Kampala', 'Hanoï', 'A'),
(18, 'Quelle est la capitale de l\'Iraq?', 'Séoul	', 'Bucarest	', 'Bagdad	', 'Tunis	', 'C'),
(19, 'Quelle est la capitale de la Jamaïque ?', 'Damas	', 'Kingston	', 'La Havane', 'Berlin', 'B'),
(20, 'Quelle est la capitale de Cuba ?', 'La Havane', 'Bakou', 'Ankara', 'Dacca', 'A'),
(21, 'En quelle année ont été crées les jeux olympiques?', '1896', '1912', '1938', '2000', 'A'),
(22, 'Combien de pays sont représentés aux Jeux Olympiques?', '147', '180', '206', '324', 'C'),
(23, 'Dans quelle ville se tiendront les Jeux Olympiques de 2028?', 'Paris', 'Londres', 'Los Angeles', 'Séoul', 'C'),
(24, 'Dans quelle ville se tiendront les Jeux olympiques de 2024?', 'Berlin', 'Londres', 'Athènes', 'Paris', 'D'),
(25, 'Combien de fois Usain Bolt a-t-il été médaillé d\'or aux Jeux Olympiques?', '5', '8', '13', '19', 'B'),
(26, 'En quelle années les femmes ont-elles eu le droit de participer aux jeux olympiques?', '1896', '1900', '1912', '1936', 'B'),
(27, 'Quel est le pourcentage de femmes qui ont participé aux Jeux Olympiques de Rio en 2016?', '12%', '27%', '39%', '45%', 'D'),
(28, 'En quelle année a été crée le tournoi de Roland Garros?', '1888', '1891', '1896', '1900', 'B'),
(29, 'Quel est le sport caractéristique du tournoi de Roland Garros?', 'Natation', 'Tennis de table', 'Basket', 'Tennis', 'D'),
(30, 'Lequel de ces prix du tournoi de Roland Garros n\'existe pas?', 'Le prix citron', 'Le prix bourgeon', 'Le prix orange', 'Le prix kaki', 'D'),
(31, 'L\'homme qui a donné son nom au tournoi Roland Garros était...', 'Tennisman', 'Aviateur', 'Footballeur', 'Conducteur de formule 1', 'B');

-- --------------------------------------------------------

--
-- Structure de la table `quizz`
--

CREATE TABLE `quizz` (
  `Categorie` int(11) NOT NULL,
  `Question` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `quizz`
--

INSERT INTO `quizz` (`Categorie`, `Question`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(2, 21),
(2, 22),
(2, 23),
(2, 24),
(2, 25),
(2, 26),
(2, 27),
(2, 28),
(2, 29),
(2, 30),
(2, 31);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`CategorieID`);

--
-- Index pour la table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`QuestionID`);

--
-- Index pour la table `quizz`
--
ALTER TABLE `quizz`
  ADD PRIMARY KEY (`Categorie`,`Question`),
  ADD KEY `fk_foreign_Question` (`Question`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `CategorieID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `question`
--
ALTER TABLE `question`
  MODIFY `QuestionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `quizz`
--
ALTER TABLE `quizz`
  ADD CONSTRAINT `fk_foreign_Categoie` FOREIGN KEY (`Categorie`) REFERENCES `categorie` (`CategorieID`),
  ADD CONSTRAINT `fk_foreign_Question` FOREIGN KEY (`Question`) REFERENCES `question` (`QuestionID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
