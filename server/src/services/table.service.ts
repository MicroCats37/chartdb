import { z } from 'zod';
import prisma from '../db.js';
import { dbFieldSchema } from '../lib/domain/db-field.js';
import { dbIndexSchema } from '../lib/domain/db-index.js';
import { dbCheckConstraintSchema } from '../lib/domain/db-check-constraint.js';
import { ensureTimestamp } from '../lib/utils/timestamp.js';
import { normalizeNewlines } from '../lib/utils/text.js';

const timestampSchema = z.union([z.number(), z.string(), z.date()]);

export const tableInputSchema = z.object({
    id: z.string(),
    diagramId: z.string(),
    name: z.string(),
    x: z.number(),
    y: z.number(),
    color: z.string(),
    fields: z.array(dbFieldSchema),
    indexes: z.array(dbIndexSchema),
    checkConstraints: z.array(dbCheckConstraintSchema).or(z.null()).optional(),
    isView: z.boolean(),
    isMaterializedView: z.boolean().or(z.null()).optional(),
    schema: z.string().or(z.null()).optional(),
    width: z.number().or(z.null()).optional(),
    comments: z.string().or(z.null()).optional(),
    order: z.number().or(z.null()).optional(),
    expanded: z.boolean().or(z.null()).optional(),
    parentAreaId: z.string().or(z.null()).optional(),
    createdAt: timestampSchema,
});

export const tableUpdateSchema = z.object({
    name: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    color: z.string().optional(),
    fields: z.array(dbFieldSchema).optional(),
    indexes: z.array(dbIndexSchema).optional(),
    checkConstraints: z.array(dbCheckConstraintSchema).or(z.null()).optional(),
    isView: z.boolean().optional(),
    isMaterializedView: z.boolean().or(z.null()).optional(),
    width: z.number().or(z.null()).optional(),
    comments: z.string().or(z.null()).optional(),
    order: z.number().or(z.null()).optional(),
    expanded: z.boolean().or(z.null()).optional(),
    parentAreaId: z.string().or(z.null()).optional(),
});

export type TableInput = z.infer<typeof tableInputSchema>;
export type TableUpdate = z.infer<typeof tableUpdateSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseTableRow = (t: any) => {
    return {
        ...t,
        fields: JSON.parse(t.fields || '[]'),
        indexes: JSON.parse(t.indexes || '[]'),
        checkConstraints: t.checkConstraints
            ? JSON.parse(t.checkConstraints)
            : undefined,
    };
};

export const tableService = {
    list: async (diagramId?: string) => {
        const tables = diagramId
            ? await prisma.dBTable.findMany({ where: { diagramId } })
            : await prisma.dBTable.findMany();

        return tables.map(parseTableRow);
    },

    get: async (id: string, diagramId?: string) => {
        const table = await prisma.dBTable.findFirst({
            where: {
                id,
                ...(diagramId ? { diagramId } : {}),
            },
        });

        if (!table) return null;

        return parseTableRow(table);
    },

    create: async (data: unknown) => {
        const parseResult = tableInputSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const {
            id,
            diagramId,
            name,
            x,
            y,
            color,
            fields,
            indexes,
            checkConstraints,
            isView,
            isMaterializedView,
            createdAt,
            width,
            comments,
            order,
            expanded,
            parentAreaId,
        } = parseResult.data;

        // Verify diagram exists before creating table
        const existingDiagram = await prisma.diagram.findUnique({
            where: { id: diagramId },
        });
        if (!existingDiagram) {
            throw new Error('Diagram not found');
        }

        await prisma.dBTable.create({
            data: {
                id,
                diagramId,
                name: name || 'Nueva Tabla',
                x: x ?? 0,
                y: y ?? 0,
                color: color || '#ffffff',
                fields: JSON.stringify(
                    fields?.map((f) => ({
                        ...f,
                        comments: f.comments
                            ? normalizeNewlines(f.comments)
                            : f.comments,
                    })) ?? []
                ),
                indexes: JSON.stringify(
                    indexes?.map((idx) => ({
                        ...idx,
                        comments: idx.comments
                            ? normalizeNewlines(idx.comments)
                            : idx.comments,
                    })) ?? []
                ),
                checkConstraints: checkConstraints
                    ? JSON.stringify(checkConstraints)
                    : null,
                isView: !!isView,
                isMaterializedView: !!isMaterializedView,
                createdAt: ensureTimestamp(createdAt),
                width,
                comments: comments ? normalizeNewlines(comments) : comments,
                order,
                expanded: expanded !== false,
                parentAreaId,
            },
        });

        return { id };
    },

    update: async (id: string, data: unknown) => {
        const parseResult = tableUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const { fields, indexes, checkConstraints, ...rest } = parseResult.data;

        const updateData: Record<string, unknown> = { ...rest };
        if (updateData.comments) {
            updateData.comments = normalizeNewlines(
                updateData.comments as string
            );
        }
        if (fields) {
            updateData.fields = JSON.stringify(
                fields.map((f) => ({
                    ...f,
                    comments: f.comments
                        ? normalizeNewlines(f.comments)
                        : f.comments,
                }))
            );
        }
        if (indexes) {
            updateData.indexes = JSON.stringify(
                indexes.map((idx) => ({
                    ...idx,
                    comments: idx.comments
                        ? normalizeNewlines(idx.comments)
                        : idx.comments,
                }))
            );
        }
        if (checkConstraints !== undefined)
            updateData.checkConstraints = checkConstraints
                ? JSON.stringify(checkConstraints)
                : null;

        await prisma.dBTable.update({
            where: { id },
            data: updateData,
        });
    },

    delete: async (id: string) => {
        await prisma.dBTable.delete({
            where: { id },
        });
    },
};
