import { Router } from 'express';
import prisma from '../db.js';

export const configRouter = Router();

configRouter.get('/', async (req, res) => {
    try {
        const config = await prisma.chartDBConfig.findUnique({
            where: { id: 1 }
        });
        if (!config) {
            return res.json(undefined);
        }
        res.json({
            ...config,
            exportActions: config.exportActions ? JSON.parse(config.exportActions) : undefined
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

configRouter.put('/', async (req, res) => {
    try {
        const { exportActions, ...rest } = req.body;
        const config = await prisma.chartDBConfig.upsert({
            where: { id: 1 },
            update: {
                ...rest,
                exportActions: exportActions ? JSON.stringify(exportActions) : undefined
            },
            create: {
                id: 1,
                ...rest,
                defaultDiagramId: rest.defaultDiagramId || '',
                exportActions: exportActions ? JSON.stringify(exportActions) : undefined
            }
        });
        res.json(config);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});
