-- CreateTable
CREATE TABLE "Diagram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "databaseType" TEXT NOT NULL,
    "databaseEdition" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DBTable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diagramId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schema" TEXT,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "fields" TEXT NOT NULL,
    "indexes" TEXT NOT NULL,
    "checkConstraints" TEXT,
    "color" TEXT NOT NULL,
    "isView" BOOLEAN NOT NULL DEFAULT false,
    "isMaterializedView" BOOLEAN DEFAULT false,
    "createdAt" REAL NOT NULL,
    "width" REAL,
    "comments" TEXT,
    "order" INTEGER,
    "expanded" BOOLEAN DEFAULT true,
    "parentAreaId" TEXT,
    CONSTRAINT "DBTable_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DBRelationship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diagramId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceSchema" TEXT,
    "sourceTableId" TEXT NOT NULL,
    "targetSchema" TEXT,
    "targetTableId" TEXT NOT NULL,
    "sourceFieldId" TEXT NOT NULL,
    "targetFieldId" TEXT NOT NULL,
    "sourceCardinality" TEXT NOT NULL,
    "targetCardinality" TEXT NOT NULL,
    "createdAt" REAL NOT NULL,
    CONSTRAINT "DBRelationship_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DBDependency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diagramId" TEXT NOT NULL,
    "schema" TEXT,
    "tableId" TEXT NOT NULL,
    "dependentSchema" TEXT,
    "dependentTableId" TEXT NOT NULL,
    "createdAt" REAL NOT NULL,
    CONSTRAINT "DBDependency_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diagramId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER,
    CONSTRAINT "Area_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DBCustomType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diagramId" TEXT NOT NULL,
    "schema" TEXT,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "values" TEXT,
    "fields" TEXT,
    "order" INTEGER,
    CONSTRAINT "DBCustomType_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diagramId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL,
    "height" REAL NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER,
    CONSTRAINT "Note_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChartDBConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "defaultDiagramId" TEXT NOT NULL,
    "exportActions" TEXT
);

-- CreateTable
CREATE TABLE "DiagramFilter" (
    "diagramId" TEXT NOT NULL PRIMARY KEY,
    "schemaIds" TEXT,
    "tableIds" TEXT,
    CONSTRAINT "DiagramFilter_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "Diagram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
