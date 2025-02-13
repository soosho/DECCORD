-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,
    `banned` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_sign_in_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login_history` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `client_ip` VARCHAR(191) NOT NULL,
    `user_agent` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `login_history_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coins` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,
    `chain_id` INTEGER NULL,
    `price` DECIMAL(20, 8) NOT NULL,
    `api` VARCHAR(191) NULL,
    `minimum_deposit` DECIMAL(20, 8) NOT NULL,
    `minimum_withdraw` DECIMAL(20, 8) NOT NULL,
    `withdraw_fee` DECIMAL(20, 8) NOT NULL,
    `coin_status` ENUM('active', 'deactive', 'maintenance') NOT NULL DEFAULT 'active',
    `deposit_status` ENUM('active', 'deactive', 'maintenance') NOT NULL DEFAULT 'active',
    `withdraw_status` ENUM('active', 'deactive', 'maintenance') NOT NULL DEFAULT 'active',
    `ccpayment_coin_id` INTEGER NULL,
    `coin_full_name` VARCHAR(191) NULL,
    `logo_url` VARCHAR(191) NULL,

    UNIQUE INDEX `coins_symbol_key`(`symbol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `networks` (
    `id` VARCHAR(191) NOT NULL,
    `coin_id` VARCHAR(191) NOT NULL,
    `chain` VARCHAR(191) NOT NULL,
    `chain_full_name` VARCHAR(191) NOT NULL,
    `contract` VARCHAR(191) NULL,
    `precision` INTEGER NOT NULL,
    `can_deposit` BOOLEAN NOT NULL DEFAULT true,
    `can_withdraw` BOOLEAN NOT NULL DEFAULT true,
    `minimum_deposit_amount` DECIMAL(20, 8) NOT NULL,
    `minimum_withdraw_amount` DECIMAL(20, 8) NOT NULL,
    `maximum_withdraw_amount` DECIMAL(20, 8) NOT NULL,
    `is_support_memo` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `networks_coin_id_chain_key`(`coin_id`, `chain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallets` (
    `id` VARCHAR(191) NOT NULL,
    `owner_id` VARCHAR(191) NOT NULL,
    `coin_id` VARCHAR(191) NOT NULL,
    `balance` DECIMAL(20, 8) NOT NULL DEFAULT 0,
    `address` VARCHAR(191) NULL,
    `memo` VARCHAR(191) NULL,

    INDEX `wallets_coin_id_idx`(`coin_id`),
    UNIQUE INDEX `wallets_owner_id_coin_id_key`(`owner_id`, `coin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet_addresses` (
    `id` VARCHAR(191) NOT NULL,
    `wallet_id` VARCHAR(191) NOT NULL,
    `network_id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `memo` VARCHAR(191) NULL,

    UNIQUE INDEX `wallet_addresses_wallet_id_network_id_key`(`wallet_id`, `network_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `login_history` ADD CONSTRAINT `login_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `networks` ADD CONSTRAINT `networks_coin_id_fkey` FOREIGN KEY (`coin_id`) REFERENCES `coins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallets` ADD CONSTRAINT `wallets_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallets` ADD CONSTRAINT `wallets_coin_id_fkey` FOREIGN KEY (`coin_id`) REFERENCES `coins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet_addresses` ADD CONSTRAINT `wallet_addresses_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet_addresses` ADD CONSTRAINT `wallet_addresses_network_id_fkey` FOREIGN KEY (`network_id`) REFERENCES `networks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
