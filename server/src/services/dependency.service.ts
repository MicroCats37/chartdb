import { z } from 'zod';
import prisma from '../db.js';
import { ensureTimestamp } from '../lib/utils/timestamp.js';

const optionalTimestampSchema = z
    .union([z.number(), z.string(), z.date()])
    .optional();

export const dependencyInputSchema = z.object({
    id: z.string(),
    diagramId: z.string(),
    schema: z.string().or(z.null()).optional(),
    tableId: z.string(),
    dependentSchema: z.string().or(z.null()).optional(),
    dependentTableId: z.string(),
    createdAt: optionalTimestampSchema,
});

export const dependencyUpdateSchema = z.object({
    schema: z.string().or(z.null()).optional(),
    tableId: z.string().optional(),
    dependentSchema: z.string().or(z.null()).optional(),
    dependentTableId: z.string().optional(),
});

export type DependencyInput = z.infer<typeof dependencyInputSchema>;
export type DependencyUpdate = z.infer<typeof dependencyUpdateSchema>;

export const dependencyService = {
    list: async (diagramId?: string) => {
        const items = diagramId
            ? await prisma.dBDependency.findMany({ where: { diagramId } })
            : await prisma.dBDependency.findMany();
        return items;
    },

    get: async (id: string, diagramId?: string) => {
        return prisma.dBDependency.findFirst({
            where: {
                id,
                ...(diagramId ? { diagramId } : {}),
            },
        });
    },

    create: async (data: unknown) => {
        const parseResult = dependencyInputSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const { createdAt, ...rest } = parseResult.data;

        await prisma.dBDependency.create({
            data: { ...rest, createdAt: ensureTimestamp(createdAt) },
        });

        return { id: parseResult.data.id };
    },

    update: async (id: string, data: unknown) => {
        const parseResult = dependencyUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        await prisma.dBDependency.update({
            where: { id },
            data: parseResult.data,
        });
    },

    delete: async (id: string, diagramId?: string) => {
        await prisma.dBDependency.deleteMany({
            where: {
                id,
                ...(diagramId ? { diagramId } : {}),
            },
        });
    },

    deleteAll: async (diagramId: string) => {
        await prisma.dBDependency.deleteMany({
            where: { diagramId },
        });
    },
};
