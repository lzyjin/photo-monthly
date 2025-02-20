-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Calendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '기본 캘린더',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Calendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Calendar" ("createdAt", "id", "name", "updatedAt", "userId") SELECT "createdAt", "id", coalesce("name", '기본 캘린더') AS "name", "updatedAt", "userId" FROM "Calendar";
DROP TABLE "Calendar";
ALTER TABLE "new_Calendar" RENAME TO "Calendar";
CREATE UNIQUE INDEX "Calendar_name_key" ON "Calendar"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
