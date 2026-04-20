import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = 'http://127.0.0.1:3001/api';

describe('Geometry API (Areas & Notes)', () => {
    const diagramId = `diag-geom-test-${Date.now()}`;

    beforeAll(async () => {
        await fetch(`${BASE_URL}/diagrams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: diagramId, name: 'Diagrama Geometría' }),
        });
    });

    afterAll(async () => {
        await fetch(`${BASE_URL}/diagrams/${diagramId}`, { method: 'DELETE' });
    });

    it('POST /api/areas - Debe crear un área', async () => {
        const res = await fetch(`${BASE_URL}/areas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `area-${Date.now()}`,
                diagramId: diagramId,
                name: 'Zona Legales',
                x: 0,
                y: 0,
                width: 500,
                height: 500,
                color: '#ff0000',
            }),
        });
        expect(res.status).toBe(201);
    });

    it('POST /api/notes - Debe crear una nota', async () => {
        const res = await fetch(`${BASE_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `note-${Date.now()}`,
                diagramId: diagramId,
                content: 'Esta tabla requiere auditoría especial',
                x: 100,
                y: 100,
                width: 200,
                height: 150,
                color: '#ffff00',
            }),
        });
        expect(res.status).toBe(201);
    });

    it('Verificar recuperación de ambos', async () => {
        const resAreas = await fetch(
            `${BASE_URL}/areas?diagramId=${diagramId}`
        );
        const areas = await resAreas.json();
        expect(areas.length).toBe(1);

        const resNotes = await fetch(
            `${BASE_URL}/notes?diagramId=${diagramId}`
        );
        const notes = await resNotes.json();
        expect(notes.length).toBe(1);
    });
});
