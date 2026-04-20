import { Router } from 'express';
import { ZodError } from 'zod';
import { configService } from '../services/config.service.js';

export const configRouter = Router();

configRouter.get('/', async (req, res) => {
    try {
        const config = await configService.get();
        if (!config) {
            return res.json(undefined);
        }
        res.json(config);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

configRouter.put('/', async (req, res) => {
    try {
        const config = await configService.update(req.body);
        res.json(config);
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
