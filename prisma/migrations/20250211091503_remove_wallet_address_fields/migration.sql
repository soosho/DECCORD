/*
  Warnings:

  - You are about to drop the column `address` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `memo` on the `wallets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `wallets` DROP COLUMN `address`,
    DROP COLUMN `memo`;
