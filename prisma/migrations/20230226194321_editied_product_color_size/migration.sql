/*
  Warnings:

  - The primary key for the `productColorSizes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "productColorSizes" DROP CONSTRAINT "productColorSizes_pkey",
ADD CONSTRAINT "productColorSizes_pkey" PRIMARY KEY ("productId", "color", "size");
