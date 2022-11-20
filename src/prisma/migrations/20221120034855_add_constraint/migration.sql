/*
  Warnings:

  - A unique constraint covering the columns `[number,userId]` on the table `Memo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Memo_number_userId_key" ON "Memo"("number", "userId");
