-- AlterTable
ALTER TABLE `character` ADD COLUMN `background` VARCHAR(191) NULL,
    ADD COLUMN `birth` VARCHAR(191) NULL,
    ADD COLUMN `birthplace` VARCHAR(191) NULL,
    ADD COLUMN `current_sanity_points` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `fear` VARCHAR(191) NULL,
    ADD COLUMN `is_creazy` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `max_sanity_points` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `occupation` VARCHAR(191) NULL,
    ADD COLUMN `specialItem` VARCHAR(191) NULL,
    ADD COLUMN `weight` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `character_inventory` (
    `character_id` INTEGER NOT NULL,
    `inventory_id` INTEGER NOT NULL,
    `value` VARCHAR(191) NULL,

    PRIMARY KEY (`character_id`, `inventory_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `weight` DOUBLE NULL DEFAULT 0.00,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `character_inventory` ADD CONSTRAINT `character_inventory_character_id_fkey` FOREIGN KEY (`character_id`) REFERENCES `character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_inventory` ADD CONSTRAINT `character_inventory_inventory_id_fkey` FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
