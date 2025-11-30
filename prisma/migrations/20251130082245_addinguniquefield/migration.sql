/*
  Warnings:

  - A unique constraint covering the columns `[orderName]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'New';

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderName_key" ON "Order"("orderName");
