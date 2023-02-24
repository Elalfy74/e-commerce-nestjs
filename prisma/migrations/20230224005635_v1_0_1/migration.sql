/*
  Warnings:

  - Added the required column `desc` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "subcategories_name_key";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "desc" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
