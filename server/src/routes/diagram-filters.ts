import { Router } from 'express';
import prisma from '../db.js';

export const diagramFiltersRouter = Router();

diagramFiltersRouter.get('/:diagramId', async (req, res) => {
    try {
        const filter = await prisma.diagramFilter.findUnique({
            where: { diagramId: req.params.diagramId }
        });
        if (!filter) return res.json(undefined);
        
        res.json({
            schemaIds: filter.schemaIds ? JSON.parse(filter.schemaIds) : undefined,
            tableIds: filter.tableIds ? JSON.parse(filter.tableIds) : undefined,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

diagramFiltersRouter.put('/:diagramId', async (req, res) => {
    try {
        const { schemaIds, tableIds } = req.body;
        await prisma.diagramFilter.upsert({
            where: { diagramId: req.params.diagramId },
            update: {
                schemaIds: schemaIds ? JSON.stringify(schemaIds) : null,
                tableIds: tableIds ? JSON.stringify(tableIds) : null
            },
            create: {
                diagramId: req.params.diagramId,
                schemaIds: schemaIds ? JSON.stringify(schemaIds) : null,
                tableIds: tableIds ? JSON.stringify(tableIds) : null
            }
        });
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

diagramFiltersRouter.delete('/:diagramId', async (req, res) => {
    try {
        await prisma.diagramFilter.deleteMany({
            where: { diagramId: req.params.diagramId }
        });
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});
