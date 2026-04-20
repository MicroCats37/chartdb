import { z } from 'zod';
import { DatabaseEdition } from './database-edition.js';
import { DatabaseType } from './database-type.js';
import { dbDependencySchema } from './db-dependency.js';
import { dbRelationshipSchema } from './db-relationship.js';
import { dbTableSchema } from './db-table.js';
import { areaSchema } from './area.js';
import { dbCustomTypeSchema } from './db-custom-type.js';
import { noteSchema } from './note.js';

export interface Diagram {
    id: string;
    name: string;
    databaseType: DatabaseType;
    databaseEdition?: DatabaseEdition;
    tables?: unknown[];
    relationships?: unknown[];
    dependencies?: unknown[];
    areas?: unknown[];
    customTypes?: unknown[];
    notes?: unknown[];
    createdAt: Date;
    updatedAt: Date;
}

export const diagramSchema = z.object({
    id: z.string(),
    name: z.string(),
    databaseType: z.nativeEnum(DatabaseType),
    databaseEdition: z.nativeEnum(DatabaseEdition).optional(),
    tables: z.array(dbTableSchema).optional(),
    relationships: z.array(dbRelationshipSchema).optional(),
    dependencies: z.array(dbDependencySchema).optional(),
    areas: z.array(areaSchema).optional(),
    customTypes: z.array(dbCustomTypeSchema).optional(),
    notes: z.array(noteSchema).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
