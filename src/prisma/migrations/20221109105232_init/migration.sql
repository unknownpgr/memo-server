-- CreateTable
CREATE TABLE "Memo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MemoToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MemoToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Memo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MemoToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_MemoToTag_AB_unique" ON "_MemoToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_MemoToTag_B_index" ON "_MemoToTag"("B");
