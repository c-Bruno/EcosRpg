-- CreateTable
CREATE TABLE `character_combat` (
    `character_id` INTEGER NOT NULL,
    `combat_id` INTEGER NOT NULL,
    `value` VARCHAR(191) NULL,

    PRIMARY KEY (`character_id`, `combat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `combat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weapon` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `damage` VARCHAR(191) NULL,
    `current_load` VARCHAR(191) NULL,
    `total_load` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `character_combat` ADD CONSTRAINT `character_combat_character_id_fkey` FOREIGN KEY (`character_id`) REFERENCES `character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_combat` ADD CONSTRAINT `character_combat_combat_id_fkey` FOREIGN KEY (`combat_id`) REFERENCES `combat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
