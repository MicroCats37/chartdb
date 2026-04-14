import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://127.0.0.1:3001/api';

describe('Diagrams API', () => {
    let diagramId: string;

    it('POST /api/diagrams - Debe crear un nuevo diagrama', async () => {
        const res = await fetch(`${BASE_URL}/diagrams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `diag-test-${Date.now()}`,
                name: 'Diagrama de Prueba Unitario',
                databaseType: 'sqlite'
            })
        });
        const data = await res.json();
        expect(res.status).toBe(201);
        diagramId = data.id;
        expect(diagramId).toBeDefined();
    });

    it('GET /api/diagrams - Debe listar los diagramas', async () => {
        const res = await fetch(`${BASE_URL}/diagrams`);
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(data.some((d: any) => d.id === diagramId)).toBe(true);
    });

    it('PUT /api/diagrams/:id - Debe actualizar el nombre', async () => {
        const res = await fetch(`${BASE_URL}/diagrams/${diagramId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Nombre Actualizado' })
        });
        expect(res.status).toBe(200);

        const check = await fetch(`${BASE_URL}/diagrams/${diagramId}`);
        const data = await check.json();
        expect(data.name).toBe('Nombre Actualizado');
    });

    it('DELETE /api/diagrams/:id - Debe eliminar el diagrama', async () => {
        const res = await fetch(`${BASE_URL}/diagrams/${diagramId}`, { method: 'DELETE' });
        expect(res.status).toBe(200);

        await new Promise(resolve => setTimeout(resolve, 500));

        const check = await fetch(`${BASE_URL}/diagrams/${diagramId}?t=${Date.now()}`);
        expect(check.status).toBe(404);
    });
});
