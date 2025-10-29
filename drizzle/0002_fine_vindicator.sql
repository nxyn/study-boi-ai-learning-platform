CREATE TABLE `discussion_likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`discussion_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`discussion_id`) REFERENCES `discussions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reply_likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reply_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`reply_id`) REFERENCES `discussion_replies`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `discussion_replies` ADD `user_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `discussions` ADD `user_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `quizzes` ADD `user_name` text NOT NULL;