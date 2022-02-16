/*
  Warnings:

  - Added the required column `character_id` to the `inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventory` ADD COLUMN `character_id` INTEGER NOT NULL;
