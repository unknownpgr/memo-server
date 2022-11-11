/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tag_value_key" ON "Tag"("value");
