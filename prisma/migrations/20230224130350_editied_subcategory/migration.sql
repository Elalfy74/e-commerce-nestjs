/*
  Warnings:

  - You are about to drop the column `subCategoryId` on the `products` table. All the data in the column will be lost.
  - The primary key for the `subcategories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `subcategories` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryName` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "subCategoryId",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "subCategoryName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subcategories" DROP CONSTRAINT "subcategories_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "subcategories_pkey" PRIMARY KEY ("categoryId", "name");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_subCategoryName_fkey" FOREIGN KEY ("categoryId", "subCategoryName") REFERENCES "subcategories"("categoryId", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
