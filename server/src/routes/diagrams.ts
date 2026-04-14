import { Router } from 'express';
import prisma from '../db.js';

export const diagramsRouter = Router();

diagramsRouter.get('/', async (req, res) => {
    try {
        const items = await prisma.diagram.findMany();
        res.json(items);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
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
            includeNotes 
        } = req.query;

        const diagram = await prisma.diagram.findUnique({
            where: { id: req.params.id },
            include: {
                tables: includeTables === 'true',
                relationships: includeRelationships === 'true',
                dependencies: includeDependencies === 'true',
                areas: includeAreas === 'true',
                customTypes: includeCustomTypes === 'true',
                notes: includeNotes === 'true',
            }
        });

        if (!diagram) return res.sendStatus(404);

        if (diagram.tables) {
            diagram.tables = diagram.tables.map((t: any) => ({
                ...t,
                fields: JSON.parse(t.fields),
                indexes: JSON.parse(t.indexes),
                checkConstraints: t.checkConstraints ? JSON.parse(t.checkConstraints) : undefined
            })) as any;
        }

        res.json(diagram);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

diagramsRouter.post('/', async (req, res) => {
    try {
        const {
            id,
            name,
            databaseType,
            databaseEdition,
            tables = [],
            relationships = [],
            dependencies = [],
            areas = [],
            customTypes = [],
            notes = [],
            createdAt,
            updatedAt
        } = req.body;

        await prisma.$transaction(async (tx: any) => {
            await tx.diagram.create({
                data: {
                    id,
                    name,
                    databaseType: databaseType || 'sqlite',
                    databaseEdition: databaseEdition || null,
                    createdAt: createdAt ? new Date(createdAt) : new Date(),
                    updatedAt: updatedAt ? new Date(updatedAt) : new Date()
                }
            });

            if (tables.length > 0) {
                await tx.dBTable.createMany({
                    data: tables.map((t: any) => ({
                        ...t,
                        diagramId: id,
                        fields: JSON.stringify(t.fields || []),
                        indexes: JSON.stringify(t.indexes || []),
                        checkConstraints: t.checkConstraints ? JSON.stringify(t.checkConstraints) : null
                    }))
                });
            }
        });

        res.status(201).json({ id });
    } catch (e: any) {
        console.error('[POST DIAGRAM ERROR]', e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

diagramsRouter.put('/:id', async (req, res) => {
    try {
        const attributes = req.body;
        const updateData: any = { ...attributes };
        if (attributes.createdAt) updateData.createdAt = new Date(attributes.createdAt);
        if (attributes.updatedAt) updateData.updatedAt = new Date(attributes.updatedAt);
        
        await prisma.diagram.update({
            where: { id: req.params.id },
            data: updateData
        });
        res.sendStatus(200);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

diagramsRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.diagram.delete({ where: { id } });
        res.sendStatus(200);
    } catch (e: any) {
        console.error('[DELETE DIAGRAM ERROR]', e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});
