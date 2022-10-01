/*
  Warnings:

  - The primary key for the `character_attributes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `skill_id` to the `character_attributes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `character_attributes` DROP PRIMARY KEY,
    ADD COLUMN `skill_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`character_id`, `attribute_id`, `skill_id`);

-- AddForeignKey
ALTER TABLE `character_attributes` ADD CONSTRAINT `character_attributes_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
