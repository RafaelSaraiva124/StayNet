ALTER TABLE "partner_applications" DROP CONSTRAINT "partner_applications_reviewed_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "partner_applications" DROP COLUMN "reviewed_by";--> statement-breakpoint
ALTER TABLE "partner_applications" DROP COLUMN "reviewed_at";