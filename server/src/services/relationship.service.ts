import { z } from 'zod';
import prisma from '../db.js';
import { ensureTimestamp } from '../lib/utils/timestamp.js';

const optionalTimestampSchema = z
    .union([z.number(), z.string(), z.date()])
    .optional();

export const relationshipInputSchema = z.object({
    id: z.string(),
    diagramId: z.string(),
    name: z.string().optional(),
    sourceSchema: z.string().or(z.null()).optional(),
    sourceTableId: z.string(),
    targetSchema: z.string().or(z.null()).optional(),
    targetTableId: z.string(),
    sourceFieldId: z.string(),
    targetFieldId: z.string(),
    sourceCardinality: z.union([z.literal('one'), z.literal('many')]),
    targetCardinality: z.union([z.literal('one'), z.literal('many')]),
    createdAt: optionalTimestampSchema,
});

export const relationshipUpdateSchema = z.object({
    name: z.string().optional(),
    sourceSchema: z.string().or(z.null()).optional(),
    sourceTableId: z.string().optional(),
    targetSchema: z.string().or(z.null()).optional(),
    targetTableId: z.string().optional(),
    sourceFieldId: z.string().optional(),
    targetFieldId: z.string().optional(),
    sourceCardinality: z
        .union([z.literal('one'), z.literal('many')])
        .optional(),
    targetCardinality: z
        .union([z.literal('one'), z.literal('many')])
        .optional(),
});

export type RelationshipInput = z.infer<typeof relationshipInputSchema>;
export type RelationshipUpdate = z.infer<typeof relationshipUpdateSchema>;

export const relationshipService = {
    list: async (diagramId?: string) => {
        const items = diagramId
            ? await prisma.dBRelationship.findMany({ where: { diagramId } })
            : await prisma.dBRelationship.findMany();
        return items;
    },

    get: async (id: string) => {
        return prisma.dBRelationship.findUnique({ where: { id } });
    },

    create: async (data: unknown) => {
        const parseResult = relationshipInputSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const {
            id,
            diagramId,
            name,
            sourceSchema,
            sourceTableId,
            targetSchema,
            targetTableId,
            sourceFieldId,
            targetFieldId,
            sourceCardinality,
            targetCardinality,
            createdAt,
        } = parseResult.data;

        await prisma.dBRelationship.create({
            data: {
                id,
                diagramId,
                name: name || '',
                sourceSchema,
                sourceTableId,
                targetSchema,
                targetTableId,
                sourceFieldId,
                targetFieldId,
                sourceCardinality: sourceCardinality || 'one',
                targetCardinality: targetCardinality || 'many',
                createdAt: ensureTimestamp(createdAt),
            },
        });

        return { id };
    },

    update: async (id: string, data: unknown) => {
        const parseResult = relationshipUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        await prisma.dBRelationship.update({
            where: { id },
            data: parseResult.data,
        });
    },

    delete: async (id: string) => {
        await prisma.dBRelationship.delete({ where: { id } });
    },
};
