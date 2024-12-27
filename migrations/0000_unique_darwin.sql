CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`isCompleted` integer DEFAULT false NOT NULL,
	`scheduleDate` integer NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP)
);
