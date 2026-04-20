import { Router } from 'express';
import { ZodError } from 'zod';
import { areaService } from '../services/area.service.js';

export const areasRouter = Router();

areasRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = await areaService.list(diagramId);
        res.json(items);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

areasRouter.post('/', async (req, res) => {
    try {
        const result = await areaService.create(req.body);
        res.status(201).json(result);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: e.flatten(),
            });
        }
        console.error('[POST AREA ERROR]', e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

areasRouter.put('/:id', async (req, res) => {
    try {
        await areaService.update(req.params.id, req.body);
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

areasRouter.delete('/:id', async (req, res) => {
    try {
        await areaService.delete(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});
