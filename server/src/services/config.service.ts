import { z } from 'zod';
import prisma from '../db.js';

export const configUpdateSchema = z.object({
    defaultDiagramId: z.string().optional(),
    exportActions: z.array(z.date()).optional(),
});

export type ConfigUpdate = z.infer<typeof configUpdateSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseConfigRow = (c: any) => {
    return {
        ...c,
        exportActions: c.exportActions
            ? JSON.parse(c.exportActions)
            : undefined,
    };
};

export const configService = {
    get: async () => {
        const config = await prisma.chartDBConfig.findUnique({
            where: { id: 1 },
        });

        if (!config) return null;

        return parseConfigRow(config);
    },

    update: async (data: unknown) => {
        const parseResult = configUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw parseResult.error;
        }

        const { exportActions, ...rest } = parseResult.data;

        const config = await prisma.chartDBConfig.upsert({
            where: { id: 1 },
            update: {
                ...rest,
                exportActions: exportActions
                    ? JSON.stringify(exportActions)
                    : undefined,
            },
            create: {
                id: 1,
                ...rest,
                defaultDiagramId: rest.defaultDiagramId || '',
                exportActions: exportActions
                    ? JSON.stringify(exportActions)
                    : undefined,
            },
        });

        return parseConfigRow(config);
    },
};
