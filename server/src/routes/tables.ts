import { Router } from 'express';
import { ZodError } from 'zod';
import { tableService } from '../services/table.service.js';

export const tablesRouter = Router();

tablesRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const tables = await tableService.list(diagramId);
        res.json(tables);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

tablesRouter.get('/:id', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const table = await tableService.get(req.params.id, diagramId);
        if (!table) return res.sendStatus(404);
        res.json(table);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

tablesRouter.post('/', async (req, res) => {
    try {
        const result = await tableService.create(req.body);
        res.status(201).json(result);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: e.flatten(),
            });
        }
        console.error('[POST TABLE ERROR]', e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

tablesRouter.put('/:id', async (req, res) => {
    try {
        await tableService.update(req.params.id, req.body);
        res.sendStatus(200);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: e.flatten(),
            });
        }
        console.error('[UPDATE TABLE ERROR]', e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

tablesRouter.delete('/:id', async (req, res) => {
    try {
        await tableService.delete(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        console.error('[DELETE TABLE ERROR]', e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});
