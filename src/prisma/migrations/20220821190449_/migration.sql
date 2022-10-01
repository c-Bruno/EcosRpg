/*
  Warnings:

  - You are about to drop the column `skill_id` on the `attribute` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `attribute` DROP FOREIGN KEY `attribute_skill_id_fkey`;

-- AlterTable
ALTER TABLE `attribute` DROP COLUMN `skill_id`;
