CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20) NOT NULL,
	`vin` varchar(17),
	`vehicleModel` varchar(100),
	`vehicleYear` int,
	`loyaltyStatus` enum('active','periodic','inactive') NOT NULL DEFAULT 'active',
	`totalSpent` decimal(10,2) DEFAULT '0',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_vin_unique` UNIQUE(`vin`)
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileType` enum('original','modified') NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` int,
	`checksum` varchar(64),
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderTimeline` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`comment` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderTimeline_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('new','in_progress','waiting','completed','cancelled') NOT NULL DEFAULT 'new',
	`serviceType` varchar(100),
	`baseCost` decimal(10,2) NOT NULL,
	`margin` decimal(5,2) DEFAULT '20',
	`taxRate` decimal(5,2) DEFAULT '23',
	`totalCost` decimal(10,2),
	`paymentStatus` enum('pending','paid','overdue') NOT NULL DEFAULT 'pending',
	`startDate` timestamp,
	`completionDate` timestamp,
	`internalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paymentMethod` varchar(50),
	`paymentDate` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workshopName` varchar(255),
	`workshopAddress` text,
	`workshopNIP` varchar(20),
	`workshopLogo` text,
	`defaultMargin` decimal(5,2) DEFAULT '20',
	`defaultTaxRate` decimal(5,2) DEFAULT '23',
	`darkMode` boolean DEFAULT true,
	`localMode` boolean DEFAULT true,
	`backupEnabled` boolean DEFAULT true,
	`lastBackup` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`)
);
