ALTER TABLE "verification_tokens" ALTER COLUMN "full_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_tokens" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD COLUMN "token_type" text NOT NULL;