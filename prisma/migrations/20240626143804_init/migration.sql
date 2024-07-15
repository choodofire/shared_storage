-- CreateTable
CREATE TABLE "locks_log" (
    "id" SERIAL NOT NULL,
    "subject" UUID NOT NULL,
    "subjects" JSONB NOT NULL DEFAULT '[]',
    "owner" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locks_log_pkey" PRIMARY KEY ("id")
);
