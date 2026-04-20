import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = 'http://127.0.0.1:3001/api';

describe('Tables API', () => {
    const diagramId = `diag-table-test-${Date.now()}`;
    const tableId = `table-test-${Date.now()}`;

    beforeAll(async () => {
        // Preparar diagrama para las tablas
        await fetch(`${BASE_URL}/diagrams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: diagramId,
                name: 'Diagrama para Tablas',
            }),
        });
    });

    afterAll(async () => {
        // Limpiar
        await fetch(`${BASE_URL}/diagrams/${diagramId}`, { method: 'DELETE' });
    });

    it('POST /api/tables - Debe crear una tabla con campos complejos', async () => {
        const tableData = {
            id: tableId,
            diagramId: diagramId,
            name: 'Users',
            schema: null,
            x: 50,
            y: 50,
            fields: [
                {
                    id: 'f1',
                    name: 'id',
                    type: { id: 'int', name: 'int' },
                    primaryKey: true,
                },
                {
                    id: 'f2',
                    name: 'username',
                    type: { id: 'varchar', name: 'varchar' },
                    unique: true,
                },
            ],
            color: '#1a1a1a',
        };

        const res = await fetch(`${BASE_URL}/tables`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tableData),
        });
        expect(res.status).toBe(201);
    });

    it('GET /api/tables?diagramId=... - Debe recuperar la tabla e hidratar JSON', async () => {
        const res = await fetch(`${BASE_URL}/tables?diagramId=${diagramId}`);
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.length).toBe(1);
        expect(data[0].id).toBe(tableId);
        expect(Array.isArray(data[0].fields)).toBe(true);
        expect(data[0].fields[0].name).toBe('id');
    });

    it('PUT /api/tables/:id - Debe actualizar posición y campos', async () => {
        const res = await fetch(`${BASE_URL}/tables/${tableId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                x: 200,
                fields: [{ id: 'f1', name: 'id_pk', type: { id: 'uuid' } }],
            }),
        });
        expect(res.status).toBe(200);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const check = await fetch(
            `${BASE_URL}/tables?diagramId=${diagramId}&t=${Date.now()}`
        );
        const data = await check.json();
        const table = data.find((t: { id: string }) => t.id === tableId);
        expect(table).toBeDefined();
        expect(table.x).toBe(200);
        expect(table.fields[0].name).toBe('id_pk');
    });

    it('DELETE /api/tables/:id - Debe eliminar la tabla individualmente', async () => {
        const res = await fetch(`${BASE_URL}/tables/${tableId}`, {
            method: 'DELETE',
        });
        expect(res.status).toBe(200);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const check = await fetch(
            `${BASE_URL}/tables?diagramId=${diagramId}&t=${Date.now()}`
        );
        const data = await check.json();
        expect(data.length).toBe(0);
    });
});
