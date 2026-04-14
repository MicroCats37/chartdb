import { Router } from 'express';
import prisma from '../db.js';

export const customTypesRouter = Router();

customTypesRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = diagramId 
            ? await prisma.dBCustomType.findMany({ where: { diagramId } })
            : await prisma.dBCustomType.findMany();
            
        const mapped = items.map((t: any) => ({
            ...t,
            values: t.values ? JSON.parse(t.values) : undefined,
            fields: t.fields ? JSON.parse(t.fields) : undefined
        }));
        res.json(mapped);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

customTypesRouter.get('/:id', async (req, res) => {
    try {
        const item = await prisma.dBCustomType.findFirst({
            where: { 
                id: req.params.id,
                diagramId: req.query.diagramId as string 
            }
        });
        if (!item) return res.json(undefined);
        
        res.json({
            ...item,
            values: item.values ? JSON.parse(item.values) : undefined,
            fields: item.fields ? JSON.parse(item.fields) : undefined
        });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

customTypesRouter.post('/', async (req, res) => {
    try {
        const { values, fields, ...rest } = req.body;
        await prisma.dBCustomType.create({ 
            data: {
                ...rest,
                values: values ? JSON.stringify(values) : null,
                fields: fields ? JSON.stringify(fields) : null
            }
        });
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

customTypesRouter.put('/:id', async (req, res) => {
    try {
        const { values, fields, ...rest } = req.body;
        const updateData: any = { ...rest };
        if (values !== undefined) updateData.values = values ? JSON.stringify(values) : null;
        if (fields !== undefined) updateData.fields = fields ? JSON.stringify(fields) : null;

        await prisma.dBCustomType.update({
            where: { id: req.params.id },
            data: updateData
        });
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

customTypesRouter.delete('/:id', async (req, res) => {
    try {
        await prisma.dBCustomType.deleteMany({
            where: { 
                id: req.params.id,
                ...(req.query.diagramId ? { diagramId: req.query.diagramId as string } : {})
            }
        });
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

customTypesRouter.delete('/', async (req, res) => {
    try {
        if (!req.query.diagramId) return res.status(400).json({ error: 'diagramId query parameter required' });
        await prisma.dBCustomType.deleteMany({
            where: { diagramId: req.query.diagramId as string }
        });
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
