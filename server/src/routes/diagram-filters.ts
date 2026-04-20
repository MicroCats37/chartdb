import { Router } from 'express';
import { ZodError } from 'zod';
import { filterService } from '../services/filter.service.js';

export const diagramFiltersRouter = Router();

diagramFiltersRouter.get('/:diagramId', async (req, res) => {
    try {
        const filter = await filterService.get(req.params.diagramId);
        if (!filter) return res.json(undefined);
        res.json(filter);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

diagramFiltersRouter.put('/:diagramId', async (req, res) => {
    try {
        await filterService.update(req.params.diagramId, req.body);
        res.sendStatus(200);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: e.flatten(),
            });
        }
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

diagramFiltersRouter.delete('/:diagramId', async (req, res) => {
    try {
        await filterService.delete(req.params.diagramId);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});
