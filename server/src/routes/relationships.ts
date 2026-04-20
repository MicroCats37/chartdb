import { Router } from 'express';
import { ZodError } from 'zod';
import { relationshipService } from '../services/relationship.service.js';

export const relationshipsRouter = Router();

relationshipsRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = await relationshipService.list(diagramId);
        res.json(items);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

relationshipsRouter.get('/:id', async (req, res) => {
    try {
        const item = await relationshipService.get(req.params.id);
        if (!item) return res.sendStatus(404);
        res.json(item);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

relationshipsRouter.post('/', async (req, res) => {
    try {
        const result = await relationshipService.create(req.body);
        res.status(201).json(result);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: e.flatten(),
            });
        }
        console.error('[POST RELATIONSHIP ERROR]', e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

relationshipsRouter.put('/:id', async (req, res) => {
    try {
        await relationshipService.update(req.params.id, req.body);
        res.sendStatus(200);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: e.flatten(),
            });
        }
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

relationshipsRouter.delete('/:id', async (req, res) => {
    try {
        await relationshipService.delete(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});
