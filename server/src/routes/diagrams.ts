import { Router } from 'express';
import { ZodError } from 'zod';
import { diagramService } from '../services/diagram.service.js';

export const diagramsRouter = Router();

diagramsRouter.get('/', async (req, res) => {
    try {
        const items = await diagramService.list();
        res.json(items);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

diagramsRouter.get('/:id', async (req, res) => {
    try {
        const {
            includeTables,
            includeRelationships,
            includeDependencies,
            includeAreas,
            includeCustomTypes,
            includeNotes,
        } = req.query;

        const diagram = await diagramService.get(req.params.id, {
            tables: includeTables === 'true',
            includeRelationships: includeRelationships === 'true',
            includeDependencies: includeDependencies === 'true',
            includeAreas: includeAreas === 'true',
            includeCustomTypes: includeCustomTypes === 'true',
            includeNotes: includeNotes === 'true',
        });

        if (!diagram) return res.sendStatus(404);

        res.json(diagram);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

diagramsRouter.post('/', async (req, res) => {
    try {
        const result = await diagramService.create(req.body);
        res.status(201).json(result);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: e.flatten(),
            });
        }
        console.error('[POST DIAGRAM ERROR]', e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});

diagramsRouter.put('/:id', async (req, res) => {
    try {
        await diagramService.update(req.params.id, req.body);
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

diagramsRouter.delete('/:id', async (req, res) => {
    try {
        await diagramService.delete(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        console.error('[DELETE DIAGRAM ERROR]', e);
        res.status(500).json({
            error: (e as Error).message || 'Internal server error',
        });
    }
});
