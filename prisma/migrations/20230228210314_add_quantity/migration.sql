/*
  Warnings:

  - Added the required column `quantity` to the `productColorSizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "productColorSizes" ADD COLUMN     "quantity" INTEGER NOT NULL;
