# Database Schema Specification

Defines the Prisma models to mimic IndexedDB (Dexie) storage.
These models strictly align with the local schema mapped in `storage-provider.tsx` lines 207-214 (version 12).

## Core Rules
- IDs from the frontend are used as Primary Keys (String UUIDs or unique strings).
- JSON fields are used to store nested structures like `fields` inside tables to avoid absolute normalization logic on simple columns.

## Prisma Schema (Partial Draft)
```prisma
model Diagram {
  id              String         @id
  name            String
  databaseType    String
  databaseEdition String?
  createdAt       String
  updatedAt       String
  tables          DBTable[]
  relationships   DBRelationship[]
  dependencies    DBDependency[]
  areas           Area[]
  customTypes     DBCustomType[]
  notes           Note[]
  config          DiagramConfig?
}

model DBTable {
  id                 String   @id
  diagramId          String
  diagram            Diagram  @relation(fields: [diagramId], references: [id], onDelete: Cascade)
  name               String
  schema             String?
  x                  Float
  y                  Float
  fields             String   // JSON stringified array of fields
  indexes            String   // JSON stringified array of indexes
  color              String
  createdAt          String
  width              Float?
  comment            String?
  isView             Boolean  @default(false)
  isMaterializedView Boolean  @default(false)
  order              Int?
}

model DBRelationship {
  id              String   @id
  diagramId       String
  diagram         Diagram  @relation(fields: [diagramId], references: [id], onDelete: Cascade)
  name            String
  sourceSchema    String?
  sourceTableId   String
  targetSchema    String?
  targetTableId   String
  sourceFieldId   String
  targetFieldId   String
  createdAt       String
}
```
*Note: JSON fields typed as `String` in SQLite for SQLite JSON support compatibility if using stringified representation, or native JSON where supported.*
