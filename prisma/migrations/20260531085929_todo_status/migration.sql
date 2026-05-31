/*
  Warnings:

  - Added the required column `todo_status` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todos` ADD COLUMN `todo_status` ENUM('PENDING', 'COMPLETED') NOT NULL;
