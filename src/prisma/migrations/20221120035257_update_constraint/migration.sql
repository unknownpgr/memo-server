/*
  Warnings:

  - A unique constraint covering the columns `[userId,number]` on the table `Memo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Memo_number_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Memo_userId_number_key" ON "Memo"("userId", "number");
