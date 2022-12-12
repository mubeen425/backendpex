-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Nov 28, 2022 at 02:02 PM
-- Server version: 5.7.34
-- PHP Version: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prime_crypto`
--

-- --------------------------------------------------------

--
-- Table structure for table `active_trade`
--

CREATE TABLE `active_trade` (
  `id` int(11) NOT NULL,
  `user_id` text NOT NULL,
  `crypto_name` text NOT NULL,
  `crypto_purchase_price` decimal(10,0) NOT NULL,
  `investment` decimal(10,0) NOT NULL,
  `trade` decimal(10,0) NOT NULL,
  `admin_profit` decimal(10,0) NOT NULL,
  `invested_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trade_profit_end` decimal(10,0) DEFAULT NULL,
  `trade_loss_end` decimal(10,0) DEFAULT NULL,
  `status` text,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `active_trade`
--

INSERT INTO `active_trade` (`id`, `user_id`, `crypto_name`, `crypto_purchase_price`, `investment`, `trade`, `admin_profit`, `invested_date`, `trade_profit_end`, `trade_loss_end`, `status`, `updated_at`) VALUES
(1, '1', 'BTC', '10000', '1000', '985', '15', '2022-11-28 16:58:45', NULL, NULL, 'Open', '2022-11-28 12:16:00'),
(2, '1', 'BTC', '12000', '100', '99', '2', '2022-11-28 12:19:00', NULL, NULL, 'Open', '2022-11-28 12:19:40');

-- --------------------------------------------------------

--
-- Table structure for table `deposit_requests`
--

CREATE TABLE `deposit_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `requested_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `request_status` varchar(50) NOT NULL,
  `status_description` text,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `deposit_requests`
--

INSERT INTO `deposit_requests` (`id`, `user_id`, `amount`, `requested_at`, `request_status`, `status_description`, `updated_at`, `updated_by`) VALUES
(1, 1, 100, '2022-11-22 22:24:05', 'Approved', 'please check', '2022-11-23 09:57:00', 1),
(3, 1, 110, '2022-11-22 17:31:00', 'Rejected', 'wrong amount', '2022-11-23 09:57:00', 1),
(4, 1, 110, '2022-11-22 17:32:00', 'Approved', 'No', '2022-11-23 07:37:00', 1),
(5, 1, 10, '2022-11-22 17:49:00', 'Approved', NULL, '2022-11-23 07:38:00', 1),
(6, 1, 110, '2022-11-22 18:11:00', 'Pending', NULL, NULL, NULL),
(7, 1, 110, '2022-11-22 18:11:00', 'Approved', NULL, '2022-11-23 07:29:00', 1),
(8, 1, 10, '2022-11-22 18:13:00', 'Rejected', 'Required SS', '2022-11-23 07:24:00', 1),
(9, 1, 20, '2022-11-22 18:28:00', 'Approved', NULL, '2022-11-23 06:29:00', 1),
(10, 2, 70, '2022-11-23 07:38:00', 'Approved', 'wrong amount', '2022-11-23 09:57:00', 1),
(11, 1, 80, '2022-11-23 11:56:00', 'Approved', NULL, '2022-11-23 12:02:00', 1),
(12, 1, 30, '2022-11-23 11:58:00', 'Approved', NULL, '2022-11-23 12:05:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `trade_history`
--

CREATE TABLE `trade_history` (
  `id` int(11) NOT NULL,
  `trade_id` int(11) NOT NULL,
  `closed_at` int(11) NOT NULL,
  `closed_price` int(11) NOT NULL,
  `profit` int(11) NOT NULL,
  `loss` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `Percentage` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `displayName` text,
  `firstName` text,
  `lastName` text,
  `contact` text,
  `email` text,
  `id_number` text,
  `password` text,
  `avatar` mediumblob,
  `status` text,
  `web_device_id` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `displayName`, `firstName`, `lastName`, `contact`, `email`, `id_number`, `password`, `avatar`, `status`, `web_device_id`, `created_at`, `updated_at`) VALUES
(1, 'JohnSmith', 'John', 'Smith', NULL, 'johnsmith@gmail.com', '812931', '$2b$10$9Jd0wEnK.LoDMwpYzkm1/eRpvVYtrkgw1Rtvwr/RiARE.MWjg5.Ci', NULL, 'logged in', NULL, '2022-11-18 13:22:33', '2022-11-18 14:09:00'),
(2, 'Jams Fank', 'jams', 'fank', NULL, 'jams@gmail.com', '271914', '$2b$10$gtN9UvQxVqmlb8kRtZXctue.hZx0JleHmzZmAFaNSZCmRXcJkdVFu', NULL, 'logged out', NULL, '2022-11-18 14:07:00', '2022-11-18 14:07:00');

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `id` int(11) NOT NULL,
  `balance` double DEFAULT NULL,
  `totalInvested` double DEFAULT NULL,
  `margin` double DEFAULT NULL,
  `pending` double DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `wallet`
--

INSERT INTO `wallet` (`id`, `balance`, `totalInvested`, `margin`, `pending`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 480, 1, 1, 1, 1, '2022-11-21 11:50:32', '2022-11-21 11:58:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `active_trade`
--
ALTER TABLE `active_trade`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deposit_requests`
--
ALTER TABLE `deposit_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trade_history`
--
ALTER TABLE `trade_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `active_trade`
--
ALTER TABLE `active_trade`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `deposit_requests`
--
ALTER TABLE `deposit_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `trade_history`
--
ALTER TABLE `trade_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
