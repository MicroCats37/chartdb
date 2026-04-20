import { Router } from 'express';
import { ZodError } from 'zod';
import { dependencyService } from '../services/dependency.service.js';

export const dependenciesRouter = Router();

dependenciesRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = await dependencyService.list(diagramId);
        res.json(items);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

dependenciesRouter.get('/:id', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const item = await dependencyService.get(req.params.id, diagramId);
        res.json(item || undefined);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

dependenciesRouter.post('/', async (req, res) => {
    try {
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

dependenciesRouter.put('/:id', async (req, res) => {
    try {
        await dependencyService.update(req.params.id, req.body);
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

dependenciesRouter.delete('/:id', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        await dependencyService.delete(req.params.id, diagramId);
        res.sendStatus(200);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

dependenciesRouter.delete('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        if (!diagramId)
            return res
                .status(400)
                .json({ error: 'diagramId query parameter required' });
        await dependencyService.deleteAll(diagramId);
        res.sendStatus(200);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
