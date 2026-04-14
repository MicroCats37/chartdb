import { Router } from 'express';
import prisma from '../db.js';

export const areasRouter = Router();

areasRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = diagramId 
            ? await prisma.area.findMany({ where: { diagramId } })
            : await prisma.area.findMany();
        res.json(items);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

areasRouter.post('/', async (req, res) => {
    try {
        const { id, diagramId, name, x, y, width, height, color, order } = req.body;
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
                order: order ?? 0
            }
        });
        res.status(201).json({ id });
    } catch (e: any) {
        console.error('[POST AREA ERROR]', e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

areasRouter.put('/:id', async (req, res) => {
    try {
        await prisma.area.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.sendStatus(200);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

areasRouter.delete('/:id', async (req, res) => {
    try {
        await prisma.area.delete({ where: { id: req.params.id } });
        res.sendStatus(200);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});
