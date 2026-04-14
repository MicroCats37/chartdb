import { Router } from 'express';
import prisma from '../db.js';

export const tablesRouter = Router();

tablesRouter.get('/', async (req, res) => {
    try {
        const diagramId = req.query.diagramId as string;
        const tables = diagramId 
            ? await prisma.dBTable.findMany({ where: { diagramId } })
            : await prisma.dBTable.findMany();
            
        const mapped = tables.map((t: any) => ({
            ...t,
            fields: JSON.parse(t.fields || '[]'),
            indexes: JSON.parse(t.indexes || '[]'),
            checkConstraints: t.checkConstraints ? JSON.parse(t.checkConstraints) : undefined
        }));
        res.json(mapped);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

tablesRouter.get('/:id', async (req, res) => {
    try {
        const table = await prisma.dBTable.findFirst({
            where: { 
                id: req.params.id,
                diagramId: req.query.diagramId as string 
            }
        });
        if (!table) return res.sendStatus(404);
        
        res.json({
            ...table,
            fields: JSON.parse(table.fields || '[]'),
            indexes: JSON.parse(table.indexes || '[]'),
            checkConstraints: table.checkConstraints ? JSON.parse(table.checkConstraints) : undefined
        });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

tablesRouter.post('/', async (req, res) => {
    try {
        const { 
            id, diagramId, name, x, y, color, fields, indexes, checkConstraints,
            isView, isMaterializedView, createdAt, width, comments, order, expanded, parentAreaId
        } = req.body;
        
        await prisma.dBTable.create({
            data: {
                id,
                diagramId,
                name: name || 'Nueva Tabla',
                x: x ?? 0,
                y: y ?? 0,
                color: color || '#ffffff',
                fields: JSON.stringify(fields || []),
                indexes: JSON.stringify(indexes || []),
                checkConstraints: checkConstraints ? JSON.stringify(checkConstraints) : null,
                isView: !!isView,
                isMaterializedView: !!isMaterializedView,
                createdAt: createdAt || Date.now(),
                width,
                comments,
                order,
                expanded: expanded !== false,
                parentAreaId
            }
        });
        res.status(201).json({ id });
    } catch (e: any) {
        console.error('[POST TABLE ERROR]', e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

tablesRouter.put('/:id', async (req, res) => {
    try {
        const { fields, indexes, checkConstraints, ...rest } = req.body;
        
        const updateData: any = { ...rest };
        if (fields) updateData.fields = JSON.stringify(fields);
        if (indexes) updateData.indexes = JSON.stringify(indexes);
        if (checkConstraints !== undefined) updateData.checkConstraints = checkConstraints ? JSON.stringify(checkConstraints) : null;

        await prisma.dBTable.update({
            where: { id: req.params.id },
            data: updateData
        });
        res.sendStatus(200);
    } catch (e: any) {
        console.error('[UPDATE TABLE ERROR]', e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});

tablesRouter.delete('/:id', async (req, res) => {
    try {
        await prisma.dBTable.delete({
            where: { id: req.params.id }
        });
        res.sendStatus(200);
    } catch (e: any) {
        console.error('[DELETE TABLE ERROR]', e);
        res.status(500).json({ error: e.message || 'Internal server error' });
    }
});
