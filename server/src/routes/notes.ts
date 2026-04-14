import { Router } from 'express';
import prisma from '../db.js';

export const notesRouter = Router();

notesRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = diagramId 
            ? await prisma.note.findMany({ where: { diagramId } })
            : await prisma.note.findMany();
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

notesRouter.get('/:id', async (req, res) => {
    try {
        const item = await prisma.note.findFirst({
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

notesRouter.post('/', async (req, res) => {
    try {
        const { id, diagramId, content, x, y, width, height, color, order } = req.body;
        await prisma.note.create({ 
            data: {
                id,
                diagramId,
                content: content || '',
                x: x ?? 0,
                y: y ?? 0,
                width: width ?? 200,
                height: height ?? 150,
                color: color || '#ffffff',
                order
            } 
        });
        res.sendStatus(201);
    } catch (e) {
        console.error('[POST NOTE ERROR]', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

notesRouter.put('/:id', async (req, res) => {
    try {
        await prisma.note.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

notesRouter.delete('/:id', async (req, res) => {
    try {
        await prisma.note.deleteMany({
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

notesRouter.delete('/', async (req, res) => {
    try {
        if (!req.query.diagramId) return res.status(400).json({ error: 'diagramId query parameter required' });
        await prisma.note.deleteMany({
            where: { diagramId: req.query.diagramId as string }
        });
        res.sendStatus(200);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
