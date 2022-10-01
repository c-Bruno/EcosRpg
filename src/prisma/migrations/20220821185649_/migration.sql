-- DropForeignKey
ALTER TABLE `attribute` DROP FOREIGN KEY `attribute_skill_id_fkey`;

-- AlterTable
ALTER TABLE `attribute` MODIFY `skill_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `attribute` ADD CONSTRAINT `attribute_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `skills`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
