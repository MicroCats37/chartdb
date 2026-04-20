import { z } from 'zod';
import prisma from '../db.js';

export const areaInputSchema = z.object({
    id: z.string(),
    diagramId: z.string(),
    name: z.string().optional(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    color: z.string().optional(),
    order: z.number().optional(),
});

export const areaUpdateSchema = z.object({
    name: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    color: z.string().optional(),
    order: z.number().optional(),
});

export type AreaInput = z.infer<typeof areaInputSchema>;
export type AreaUpdate = z.infer<typeof areaUpdateSchema>;

export const areaService = {
    list: async (diagramId?: string) => {
        const items = diagramId
            ? await prisma.area.findMany({ where: { diagramId } })
            : await prisma.area.findMany();
        return items;
    },

    get: async (id: string) => {
        return prisma.area.findUnique({ where: { id } });
    },

    create: async (data: unknown) => {
        const parseResult = areaInputSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const { id, diagramId, name, x, y, width, height, color, order } =
            parseResult.data;

        await prisma.area.create({
            data: {
                id,
                diagramId,
                name: name || 'Nueva Area',
                x: x ?? 0,
                y: y ?? 0,
                width: width ?? 200,
                height: height ?? 200,
                color: color || '#e0e0e0',
                order: order ?? 0,
            },
        });

        return { id };
    },

    update: async (id: string, data: unknown) => {
        const parseResult = areaUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        await prisma.area.update({
            where: { id },
            data: parseResult.data,
        });
    },

    delete: async (id: string) => {
        await prisma.area.delete({ where: { id } });
    },
};
