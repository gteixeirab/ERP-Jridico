-- CreateTable
CREATE TABLE "KanbanColumn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "columnType" TEXT NOT NULL DEFAULT 'custom',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    CONSTRAINT "KanbanColumn_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KanbanTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    "assignedTo" TEXT,
    "dueDate" DATETIME,
    "priority" TEXT DEFAULT 'medium',
    CONSTRAINT "KanbanTask_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "KanbanColumn" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "KanbanTask_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "KanbanColumn_id_createdBy_key" ON "KanbanColumn"("id", "createdBy");

-- CreateIndex
CREATE INDEX "KanbanTask_columnId_idx" ON "KanbanTask"("columnId");
