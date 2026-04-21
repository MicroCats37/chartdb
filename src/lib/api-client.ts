const API_BASE = import.meta.env.VITE_API_URL || '';

export async function apiGet<T>(url: string): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`);
    if (!response.ok) {
        throw new Error(`Failed to GET ${url}: ${response.statusText}`);
    }
    const text = await response.text();
    if (!text || text === 'OK') return undefined as unknown as T;
    return JSON.parse(text) as T;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error(`Failed to POST ${url}: ${response.statusText}`);
    }
    // Check if the response is 201 Created
    if (response.status === 201) return undefined as unknown as T;

    const text = await response.text();
    if (!text || text === 'OK' || text === 'Created')
        return undefined as unknown as T;
    return JSON.parse(text) as T;
}

export async function apiPut<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error(`Failed to PUT ${url}: ${response.statusText}`);
    }
    if (response.status === 200) return undefined as unknown as T;
    const text = await response.text();
    if (!text || text === 'OK') return undefined as unknown as T;
    return JSON.parse(text) as T;
}

export async function apiDelete(url: string): Promise<void> {
    const response = await fetch(`${API_BASE}${url}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`Failed to DELETE ${url}: ${response.statusText}`);
    }
}
