import { Router } from 'express';
import { ZodError } from 'zod';
import { noteService } from '../services/note.service.js';

export const notesRouter = Router();

notesRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = await noteService.list(diagramId);
        res.json(items);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

notesRouter.get('/:id', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const item = await noteService.get(req.params.id, diagramId);
        res.json(item || undefined);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

notesRouter.post('/', async (req, res) => {
    try {
        await noteService.create(req.body);
        res.sendStatus(201);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: e.flatten(),
            });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

notesRouter.put('/:id', async (req, res) => {
    try {
        await noteService.update(req.params.id, req.body);
        res.sendStatus(200);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: e.flatten(),
            });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

notesRouter.delete('/:id', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        await noteService.delete(req.params.id, diagramId);
        res.sendStatus(200);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

notesRouter.delete('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        if (!diagramId)
            return res
                .status(400)
                .json({ error: 'diagramId query parameter required' });
        await noteService.deleteAll(diagramId);
        res.sendStatus(200);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
