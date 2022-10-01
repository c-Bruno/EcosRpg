/*
  Warnings:

  - The primary key for the `character_attributes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `character_attributes` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`character_id`, `attribute_id`);
