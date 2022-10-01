/*
  Warnings:

  - You are about to drop the column `skill_id` on the `character_attributes` table. All the data in the column will be lost.
  - Added the required column `skill_id` to the `attribute` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `character_attributes` DROP FOREIGN KEY `character_attributes_skill_id_fkey`;

-- AlterTable
ALTER TABLE `attribute` ADD COLUMN `skill_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `character_attributes` DROP COLUMN `skill_id`;

-- AddForeignKey
ALTER TABLE `attribute` ADD CONSTRAINT `attribute_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
