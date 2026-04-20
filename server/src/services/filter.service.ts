import { z } from 'zod';
import prisma from '../db.js';

export const diagramFiltersUpdateSchema = z.object({
    schemaIds: z.array(z.string()).optional(),
    tableIds: z.array(z.string()).optional(),
});

export type DiagramFiltersUpdate = z.infer<typeof diagramFiltersUpdateSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseFilterRow = (f: any) => {
    return {
        ...f,
        schemaIds: f.schemaIds ? JSON.parse(f.schemaIds) : undefined,
        tableIds: f.tableIds ? JSON.parse(f.tableIds) : undefined,
    };
};

export const filterService = {
    get: async (diagramId: string) => {
        const filter = await prisma.diagramFilter.findUnique({
            where: { diagramId },
        });

        if (!filter) return null;

        return parseFilterRow(filter);
    },

    update: async (diagramId: string, data: unknown) => {
        const parseResult = diagramFiltersUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const { schemaIds, tableIds } = parseResult.data;

        await prisma.diagramFilter.upsert({
            where: { diagramId },
            update: {
                schemaIds: schemaIds ? JSON.stringify(schemaIds) : null,
                tableIds: tableIds ? JSON.stringify(tableIds) : null,
            },
            create: {
                diagramId,
                schemaIds: schemaIds ? JSON.stringify(schemaIds) : null,
                tableIds: tableIds ? JSON.stringify(tableIds) : null,
            },
        });
    },

    delete: async (diagramId: string) => {
        await prisma.diagramFilter.deleteMany({
            where: { diagramId },
        });
    },
};
