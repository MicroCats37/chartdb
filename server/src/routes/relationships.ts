import { Router } from 'express';
import prisma from '../db.js';

export const relationshipsRouter = Router();

relationshipsRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const items = diagramId 
            ? await prisma.dBRelationship.findMany({ where: { diagramId } })
            : await prisma.dBRelationship.findMany();
        res.json(items);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

relationshipsRouter.get('/:id', async (req, res) => {
    try {
        const item = await prisma.dBRelationship.findUnique({
            where: { id: req.params.id }
        });
        if (!item) return res.sendStatus(404);
        res.json(item);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

relationshipsRouter.post('/', async (req, res) => {
    try {
        const { 
            id, diagramId, name, sourceSchema, sourceTableId, targetSchema, targetTableId,
            sourceFieldId, targetFieldId, sourceCardinality, targetCardinality, createdAt
        } = req.body;
        
        await prisma.dBRelationship.create({
            data: {
                id,
                diagramId,
                name: name || '',
                sourceSchema,
                sourceTableId,
                targetSchema,
                targetTableId,
                sourceFieldId,
                targetFieldId,
                sourceCardinality: sourceCardinality || 'one',
                targetCardinality: targetCardinality || 'many',
                createdAt: createdAt || Date.now()
            }
        });
        res.status(201).json({ id });
    } catch (e: any) {
        console.error('[POST RELATIONSHIP ERROR]', e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

relationshipsRouter.put('/:id', async (req, res) => {
    try {
        await prisma.dBRelationship.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.sendStatus(200);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

relationshipsRouter.delete('/:id', async (req, res) => {
    try {
        await prisma.dBRelationship.delete({
            where: { id: req.params.id }
        });
        res.sendStatus(200);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});
