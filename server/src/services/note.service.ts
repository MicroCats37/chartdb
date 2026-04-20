import { z } from 'zod';
import prisma from '../db.js';
import { normalizeNewlines } from '../lib/utils/text.js';

export const noteInputSchema = z.object({
    id: z.string(),
    diagramId: z.string(),
    content: z.string().optional(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    color: z.string().optional(),
    order: z.number().optional(),
});

export const noteUpdateSchema = z.object({
    content: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    color: z.string().optional(),
    order: z.number().optional(),
});

export type NoteInput = z.infer<typeof noteInputSchema>;
export type NoteUpdate = z.infer<typeof noteUpdateSchema>;

export const noteService = {
    list: async (diagramId?: string) => {
        const items = diagramId
            ? await prisma.note.findMany({ where: { diagramId } })
            : await prisma.note.findMany();
        return items;
    },

    get: async (id: string, diagramId?: string) => {
        return prisma.note.findFirst({
            where: {
                id,
                ...(diagramId ? { diagramId } : {}),
            },
        });
    },

    create: async (data: unknown) => {
        const parseResult = noteInputSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const { id, diagramId, content, x, y, width, height, color, order } =
            parseResult.data;

        await prisma.note.create({
            data: {
                id,
                diagramId,
                content: normalizeNewlines(content || ''),
                x: x ?? 0,
                y: y ?? 0,
                width: width ?? 200,
                height: height ?? 150,
                color: color || '#ffffff',
                order,
            },
        });

        return { id };
    },

    update: async (id: string, data: unknown) => {
        const parseResult = noteUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const updateData = { ...parseResult.data };
        if (updateData.content !== undefined) {
            updateData.content = normalizeNewlines(updateData.content);
        }

        await prisma.note.update({
            where: { id },
            data: updateData,
        });
    },

    delete: async (id: string, diagramId?: string) => {
        await prisma.note.deleteMany({
            where: {
                id,
                ...(diagramId ? { diagramId } : {}),
            },
        });
    },

    deleteAll: async (diagramId: string) => {
        await prisma.note.deleteMany({
            where: { diagramId },
        });
    },
};
