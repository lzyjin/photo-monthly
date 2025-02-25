-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "themeColorId" INTEGER,
    "settingId" INTEGER,
    CONSTRAINT "User_themeColorId_fkey" FOREIGN KEY ("themeColorId") REFERENCES "ThemeColor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "User_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "Setting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "isDeleted", "name", "password", "themeColorId", "updatedAt") SELECT "createdAt", "email", "id", "isDeleted", "name", "password", "themeColorId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
