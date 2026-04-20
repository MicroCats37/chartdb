import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = 'http://127.0.0.1:3001/api';

describe('Relationships API', () => {
    const diagramId = `diag-rel-test-${Date.now()}`;
    const relId = `rel-test-${Date.now()}`;

    beforeAll(async () => {
        await fetch(`${BASE_URL}/diagrams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: diagramId,
                name: 'Diagrama Relaciones',
            }),
        });
    });

    afterAll(async () => {
        await fetch(`${BASE_URL}/diagrams/${diagramId}`, { method: 'DELETE' });
    });

    it('POST /api/relationships - Debe crear una relación', async () => {
        const res = await fetch(`${BASE_URL}/relationships`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: relId,
                diagramId: diagramId,
                sourceTableId: 'table1',
                targetTableId: 'table2',
                sourceFieldId: 'f1',
                targetFieldId: 'f2',
                sourceCardinality: 'one',
                targetCardinality: 'many',
            }),
        });
        expect(res.status).toBe(201);
    });

    it('GET /api/relationships?diagramId=... - Debe recuperar la relación', async () => {
        const res = await fetch(
            `${BASE_URL}/relationships?diagramId=${diagramId}`
        );
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.length).toBe(1);
        expect(data[0].id).toBe(relId);
    });

    it('DELETE /api/relationships/:id - Debe eliminar la relación', async () => {
        const res = await fetch(
            `${BASE_URL}/relationships/${relId}?diagramId=${diagramId}`,
            {
                method: 'DELETE',
            }
        );
        expect(res.status).toBe(200);

        await new Promise((resolve) => setTimeout(resolve, 500));

        const check = await fetch(
            `${BASE_URL}/relationships?diagramId=${diagramId}&t=${Date.now()}`
        );
        const data = await check.json();
        expect(data.length).toBe(0);
    });
});
