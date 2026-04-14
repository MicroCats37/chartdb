import { Router } from 'express';
import prisma from '../db.js';

export const dependenciesRouter = Router();

dependenciesRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = diagramId 
            ? await prisma.dBDependency.findMany({ where: { diagramId } })
            : await prisma.dBDependency.findMany();
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

dependenciesRouter.get('/:id', async (req, res) => {
    try {
        const item = await prisma.dBDependency.findFirst({
            where: { 
                id: req.params.id,
                diagramId: req.query.diagramId as string 
            }
        });
        res.json(item || undefined);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

dependenciesRouter.post('/', async (req, res) => {
    try {
        await prisma.dBDependency.create({ data: req.body });
        res.sendStatus(201);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

dependenciesRouter.put('/:id', async (req, res) => {
    try {
        await prisma.dBDependency.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

dependenciesRouter.delete('/:id', async (req, res) => {
    try {
        await prisma.dBDependency.deleteMany({
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

dependenciesRouter.delete('/', async (req, res) => {
    try {
        if (!req.query.diagramId) return res.status(400).json({ error: 'diagramId query parameter required' });
        await prisma.dBDependency.deleteMany({
            where: { diagramId: req.query.diagramId as string }
        });
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
