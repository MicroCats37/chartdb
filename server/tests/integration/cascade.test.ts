import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://127.0.0.1:3001/api';

describe('Cascade Deletion Integrity', () => {
    it('Debe borrar un diagrama complejo y no dejar huérfanos', async () => {
        const runId = Date.now();
        const diagramId = `cascade-test-${runId}`;

        // 1. Crear Diagrama
        const dRes = await fetch(`${BASE_URL}/diagrams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: diagramId, name: 'Complex Test' }),
        });
        expect(dRes.status).toBe(201);

        // 2. Crear Tabla, Relación, Nota, Área
        const tRes = await fetch(`${BASE_URL}/tables`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `t-${runId}`,
                diagramId,
                name: 'T1',
                fields: [],
            }),
        });
        expect(tRes.status).toBe(201);

        const nRes = await fetch(`${BASE_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `n-${runId}`,
                diagramId,
                content: 'N1',
            }),
        });
        expect(nRes.status).toBe(201);

        const aRes = await fetch(`${BASE_URL}/areas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `a-${runId}`,
                diagramId,
                name: 'A1',
                x: 0,
                y: 0,
                width: 10,
                height: 10,
            }),
        });
        expect(aRes.status).toBe(201);

        // 3. Borrar Diagrama
        const delRes = await fetch(`${BASE_URL}/diagrams/${diagramId}`, {
            method: 'DELETE',
        });
        expect(delRes.status).toBe(200);

        // 4. Verificación vía API
        await new Promise((resolve) => setTimeout(resolve, 500));

        const tablesRes = await fetch(
            `${BASE_URL}/tables?diagramId=${diagramId}`
        );
        const tables = await tablesRes.json();
        expect(tables.length).toBe(0);

        const notesRes = await fetch(
            `${BASE_URL}/notes?diagramId=${diagramId}`
        );
        const notes = await notesRes.json();
        expect(notes.length).toBe(0);

        const areasRes = await fetch(
            `${BASE_URL}/areas?diagramId=${diagramId}`
        );
        const areas = await areasRes.json();
        expect(areas.length).toBe(0);

        console.log(`[CASCADE SUCCESS] Verificado vía API para ${diagramId}`);
    });
});
