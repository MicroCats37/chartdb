import { z } from 'zod';
import prisma from '../db.js';
import { DatabaseType } from '../lib/domain/database-type.js';
import { DatabaseEdition } from '../lib/domain/database-edition.js';
import { dbFieldSchema } from '../lib/domain/db-field.js';
import { dbIndexSchema } from '../lib/domain/db-index.js';
import { dbCheckConstraintSchema } from '../lib/domain/db-check-constraint.js';
import { ensureDate, ensureTimestamp } from '../lib/utils/timestamp.js';

const timestampSchema = z.union([z.number(), z.string(), z.date()]);
const optionalTimestampSchema = timestampSchema.optional();

// Schema for table input validation (nested inside diagram)
const tableInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    x: z.number(),
    y: z.number(),
    color: z.string().optional(),
    fields: z.array(dbFieldSchema).optional(),
    indexes: z.array(dbIndexSchema).optional(),
    checkConstraints: z.array(dbCheckConstraintSchema).or(z.null()).optional(),
    isView: z.boolean().optional(),
    isMaterializedView: z.boolean().or(z.null()).optional(),
    schema: z.string().or(z.null()).optional(),
    width: z.number().or(z.null()).optional(),
    comments: z.string().or(z.null()).optional(),
    order: z.number().or(z.null()).optional(),
    expanded: z.boolean().or(z.null()).optional(),
    parentAreaId: z.string().or(z.null()).optional(),
    createdAt: optionalTimestampSchema,
});

export const diagramInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    databaseType: z.nativeEnum(DatabaseType),
    databaseEdition: z.nativeEnum(DatabaseEdition).or(z.null()).optional(),
    tables: z.array(tableInputSchema).optional(),
    createdAt: optionalTimestampSchema,
    updatedAt: optionalTimestampSchema,
});

export const diagramUpdateSchema = z.object({
    name: z.string().optional(),
    databaseType: z.nativeEnum(DatabaseType).optional(),
    databaseEdition: z.nativeEnum(DatabaseEdition).or(z.null()).optional(),
    createdAt: optionalTimestampSchema,
    updatedAt: optionalTimestampSchema,
});

export type DiagramInput = z.infer<typeof diagramInputSchema>;
export type DiagramUpdate = z.infer<typeof diagramUpdateSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseTableInclude = (include: Record<string, boolean>): any => {
    return {
        tables: include.tables,
        relationships: include.includeRelationships,
        dependencies: include.includeDependencies,
        areas: include.includeAreas,
        customTypes: include.includeCustomTypes,
        notes: include.includeNotes,
    };
};

export const diagramService = {
    list: async () => {
        return prisma.diagram.findMany();
    },

    get: async (
        id: string,
        include?: {
            tables?: boolean;
            includeRelationships?: boolean;
            includeDependencies?: boolean;
            includeAreas?: boolean;
            includeCustomTypes?: boolean;
            includeNotes?: boolean;
        }
    ) => {
        const diagram = await prisma.diagram.findUnique({
            where: { id },
            include: include ? parseTableInclude(include) : undefined,
        });

        if (!diagram) return null;

        if (diagram.tables) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (diagram as any).tables = (diagram.tables as any[]).map(
                (t: {
                    fields: string;
                    indexes: string;
                    checkConstraints: string | null;
                }) => ({
                    ...t,
                    fields: JSON.parse(t.fields),
                    indexes: JSON.parse(t.indexes),
                    checkConstraints: t.checkConstraints
                        ? JSON.parse(t.checkConstraints)
                        : undefined,
                })
            );
        }

        return diagram;
    },

    create: async (data: unknown) => {
        const parseResult = diagramInputSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const {
            id,
            name,
            databaseType,
            databaseEdition,
            tables = [],
            createdAt,
            updatedAt,
        } = parseResult.data;

        await prisma.$transaction(async (tx) => {
            await tx.diagram.create({
                data: {
                    id,
                    name,
                    databaseType: databaseType || DatabaseType.SQLITE,
                    databaseEdition: databaseEdition || null,
                    createdAt: ensureDate(createdAt),
                    updatedAt: ensureDate(updatedAt),
                },
            });

            if (tables.length > 0) {
                await tx.dBTable.createMany({
                    data: tables.map((t) => ({
                        id: t.id,
                        diagramId: id,
                        name: t.name || '',
                        x: t.x ?? 0,
                        y: t.y ?? 0,
                        color: t.color || '#ffffff',
                        fields: JSON.stringify(t.fields || []),
                        indexes: JSON.stringify(t.indexes || []),
                        checkConstraints: t.checkConstraints
                            ? JSON.stringify(t.checkConstraints)
                            : null,
                        isView: t.isView ?? false,
                        isMaterializedView: t.isMaterializedView ?? false,
                        createdAt: ensureTimestamp(t.createdAt),
                        width: t.width,
                        comments: t.comments,
                        order: t.order,
                        expanded: t.expanded !== false,
                        parentAreaId: t.parentAreaId,
                    })),
                });
            }
        });

        return { id };
    },

    update: async (id: string, data: unknown) => {
        const parseResult = diagramUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const attributes = parseResult.data;
        const updateData: Record<string, unknown> = { ...attributes };

        if (attributes.createdAt)
            updateData.createdAt = ensureDate(attributes.createdAt);
        if (attributes.updatedAt)
            updateData.updatedAt = ensureDate(attributes.updatedAt);

        await prisma.diagram.update({
            where: { id },
            data: updateData,
        });
    },

    delete: async (id: string) => {
        await prisma.diagram.delete({ where: { id } });
    },
};
