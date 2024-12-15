CREATE TYPE "public"."board_type" AS ENUM('kanban', 'scrum', 'scrumban');--> statement-breakpoint
CREATE TYPE "public"."visibility" AS ENUM('private', 'public', 'team');