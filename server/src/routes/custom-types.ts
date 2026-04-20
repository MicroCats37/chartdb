import { Router } from 'express';
import { ZodError } from 'zod';
import { customTypeService } from '../services/custom-type.service.js';

export const customTypesRouter = Router();

customTypesRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = await customTypeService.list(diagramId);
        res.json(items);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

customTypesRouter.get('/:id', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const item = await customTypeService.get(req.params.id, diagramId);
        if (!item) return res.json(undefined);
        res.json(item);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

customTypesRouter.post('/', async (req, res) => {
    try {
        await customTypeService.create(req.body);
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

customTypesRouter.put('/:id', async (req, res) => {
    try {
        await customTypeService.update(req.params.id, req.body);
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

customTypesRouter.delete('/:id', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        await customTypeService.delete(req.params.id, diagramId);
        res.sendStatus(200);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});

customTypesRouter.delete('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        if (!diagramId)
            return res
                .status(400)
                .json({ error: 'diagramId query parameter required' });
        await customTypeService.deleteAll(diagramId);
        res.sendStatus(200);
    } catch {
        res.status(500).json({ error: 'Internal server error' });
    }
});
