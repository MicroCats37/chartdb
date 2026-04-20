import { z } from 'zod';
import prisma from '../db.js';

const customTypeFieldSchema = z.object({
    field: z.string(),
    type: z.string(),
});

export const customTypeInputSchema = z.object({
    id: z.string(),
    diagramId: z.string(),
    schema: z.string().or(z.null()).optional(),
    name: z.string(),
    kind: z.enum(['enum', 'composite']),
    values: z.array(z.string()).or(z.null()).optional(),
    fields: z.array(customTypeFieldSchema).or(z.null()).optional(),
    order: z.number().or(z.null()).optional(),
});

export const customTypeUpdateSchema = z.object({
    schema: z.string().or(z.null()).optional(),
    name: z.string().optional(),
    kind: z.enum(['enum', 'composite']).optional(),
    values: z.array(z.string()).or(z.null()).optional(),
    fields: z.array(customTypeFieldSchema).or(z.null()).optional(),
    order: z.number().or(z.null()).optional(),
});

export type CustomTypeInput = z.infer<typeof customTypeInputSchema>;
export type CustomTypeUpdate = z.infer<typeof customTypeUpdateSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseCustomTypeRow = (t: any) => {
    return {
        ...t,
        values: t.values ? JSON.parse(t.values) : undefined,
        fields: t.fields ? JSON.parse(t.fields) : undefined,
    };
};

export const customTypeService = {
    list: async (diagramId?: string) => {
        const items = diagramId
            ? await prisma.dBCustomType.findMany({ where: { diagramId } })
            : await prisma.dBCustomType.findMany();

        return items.map(parseCustomTypeRow);
    },

    get: async (id: string, diagramId?: string) => {
        const item = await prisma.dBCustomType.findFirst({
            where: {
                id,
                ...(diagramId ? { diagramId } : {}),
            },
        });

        if (!item) return null;

        return parseCustomTypeRow(item);
    },

    create: async (data: unknown) => {
        const parseResult = customTypeInputSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const { values, fields, ...rest } = parseResult.data;

        await prisma.dBCustomType.create({
            data: {
                ...rest,
                values: values ? JSON.stringify(values) : null,
                fields: fields ? JSON.stringify(fields) : null,
            },
        });

        return { id: parseResult.data.id };
    },

    update: async (id: string, data: unknown) => {
        const parseResult = customTypeUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const { values, fields, ...rest } = parseResult.data;
        const updateData: Record<string, unknown> = { ...rest };
        if (values !== undefined)
            updateData.values = values ? JSON.stringify(values) : null;
        if (fields !== undefined)
            updateData.fields = fields ? JSON.stringify(fields) : null;

        await prisma.dBCustomType.update({
            where: { id },
            data: updateData,
        });
    },

    delete: async (id: string, diagramId?: string) => {
        await prisma.dBCustomType.deleteMany({
            where: {
                id,
                ...(diagramId ? { diagramId } : {}),
            },
        });
    },

    deleteAll: async (diagramId: string) => {
        await prisma.dBCustomType.deleteMany({
            where: { diagramId },
        });
    },
};
