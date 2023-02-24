/*
  Warnings:

  - You are about to drop the column `code` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "products_code_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "code",
ALTER COLUMN "quantity" SET DEFAULT 0;
