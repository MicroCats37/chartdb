import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { storageContext, type StorageContext } from './storage-context';
import type { DBTable } from '@/lib/domain/db-table';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { Diagram } from '@/lib/domain/diagram';
import type { ChartDBConfig } from '@/lib/domain/config';
import type { DBDependency } from '@/lib/domain/db-dependency';
import type { Area } from '@/lib/domain/area';
import type { DBCustomType } from '@/lib/domain/db-custom-type';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import {
    type Note,
} from '@/lib/domain/note';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';

export const StorageProvider = ({ children }: { children: ReactNode }) => {

    // Config operations
    const getConfig: StorageContext['getConfig'] = useCallback(async () => {
        return await apiGet<ChartDBConfig | undefined>('/api/config');
    }, []);

    const updateConfig: StorageContext['updateConfig'] = useCallback(
        async (config) => {
            await apiPut('/api/config', config);
        },
        []
    );

    // Filter operations
    const getDiagramFilter: StorageContext['getDiagramFilter'] = useCallback(
        async (diagramId) => {
            return await apiGet<DiagramFilter | undefined>(`/api/diagram-filters/${diagramId}`);
        },
        []
    );

    const updateDiagramFilter: StorageContext['updateDiagramFilter'] = useCallback(
        async (diagramId, filter) => {
            await apiPut(`/api/diagram-filters/${diagramId}`, filter);
        },
        []
    );

    const deleteDiagramFilter: StorageContext['deleteDiagramFilter'] = useCallback(
        async (diagramId) => {
            await apiDelete(`/api/diagram-filters/${diagramId}`);
        },
        []
    );

    // Diagram Operations
    const listDiagrams: StorageContext['listDiagrams'] = useCallback(
        async (options = {}) => {
            const diagrams = await apiGet<Diagram[]>('/api/diagrams') || [];
            return diagrams.map(d => ({
                ...d,
                createdAt: new Date(d.createdAt),
                updatedAt: new Date(d.updatedAt)
            }));
        },
        []
    );

    const getDiagram: StorageContext['getDiagram'] = useCallback(
        async (id, options = {}) => {
            const queryParams = new URLSearchParams();
            if (options.includeTables) queryParams.append('includeTables', 'true');
            if (options.includeRelationships) queryParams.append('includeRelationships', 'true');
            if (options.includeDependencies) queryParams.append('includeDependencies', 'true');
            if (options.includeAreas) queryParams.append('includeAreas', 'true');
            if (options.includeCustomTypes) queryParams.append('includeCustomTypes', 'true');
            if (options.includeNotes) queryParams.append('includeNotes', 'true');
            
            const query = queryParams.toString();
            const diagram = await apiGet<Diagram | undefined>(`/api/diagrams/${id}${query ? `?${query}` : ''}`);
            if (diagram) {
                diagram.createdAt = new Date(diagram.createdAt);
                diagram.updatedAt = new Date(diagram.updatedAt);
            }
            return diagram;
        },
        []
    );

    const addDiagram: StorageContext['addDiagram'] = useCallback(
        async ({ diagram }) => {
            await apiPost('/api/diagrams', diagram);
        },
        []
    );

    const updateDiagram: StorageContext['updateDiagram'] = useCallback(
        async ({ id, attributes }) => {
            await apiPut(`/api/diagrams/${id}`, attributes);
        },
        []
    );

    const deleteDiagram: StorageContext['deleteDiagram'] = useCallback(
        async (id) => {
            await apiDelete(`/api/diagrams/${id}`);
        },
        []
    );

    // Table operations
    const addTable: StorageContext['addTable'] = useCallback(
        async ({ diagramId, table }) => {
            await apiPost('/api/tables', { diagramId, ...table });
        },
        []
    );

    const getTable: StorageContext['getTable'] = useCallback(
        async ({ diagramId, id }) => {
            return await apiGet<DBTable | undefined>(`/api/tables/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const updateTable: StorageContext['updateTable'] = useCallback(
        async ({ id, attributes }) => {
            await apiPut(`/api/tables/${id}`, attributes);
        },
        []
    );

    const putTable: StorageContext['putTable'] = useCallback(
        async ({ diagramId, table }) => {
            // Under REST, a PUT replacing the whole object or partial upsert.
            // Our backend supports partial updates via PUT, so we send the whole table.
            await apiPut(`/api/tables/${table.id}`, { diagramId, ...table });
        },
        []
    );

    const deleteTable: StorageContext['deleteTable'] = useCallback(
        async ({ diagramId, id }) => {
            await apiDelete(`/api/tables/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const listTables: StorageContext['listTables'] = useCallback(
        async (diagramId) => {
            return await apiGet<DBTable[]>(`/api/tables?diagramId=${diagramId}`);
        },
        []
    );

    const deleteDiagramTables: StorageContext['deleteDiagramTables'] = useCallback(
        async (diagramId) => {
            await apiDelete(`/api/tables?diagramId=${diagramId}`);
        },
        []
    );

    // Relationship operations
    const addRelationship: StorageContext['addRelationship'] = useCallback(
        async ({ diagramId, relationship }) => {
            await apiPost('/api/relationships', { diagramId, ...relationship });
        },
        []
    );

    const getRelationship: StorageContext['getRelationship'] = useCallback(
        async ({ diagramId, id }) => {
            return await apiGet<DBRelationship | undefined>(`/api/relationships/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const updateRelationship: StorageContext['updateRelationship'] = useCallback(
        async ({ id, attributes }) => {
            await apiPut(`/api/relationships/${id}`, attributes);
        },
        []
    );

    const deleteRelationship: StorageContext['deleteRelationship'] = useCallback(
        async ({ diagramId, id }) => {
            await apiDelete(`/api/relationships/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const listRelationships: StorageContext['listRelationships'] = useCallback(
        async (diagramId) => {
            return await apiGet<DBRelationship[]>(`/api/relationships?diagramId=${diagramId}`);
        },
        []
    );

    const deleteDiagramRelationships: StorageContext['deleteDiagramRelationships'] = useCallback(
        async (diagramId) => {
            await apiDelete(`/api/relationships?diagramId=${diagramId}`);
        },
        []
    );

    // Dependency operations
    const addDependency: StorageContext['addDependency'] = useCallback(
        async ({ diagramId, dependency }) => {
            await apiPost('/api/dependencies', { diagramId, ...dependency });
        },
        []
    );

    const getDependency: StorageContext['getDependency'] = useCallback(
        async ({ diagramId, id }) => {
            return await apiGet<DBDependency | undefined>(`/api/dependencies/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const updateDependency: StorageContext['updateDependency'] = useCallback(
        async ({ id, attributes }) => {
            await apiPut(`/api/dependencies/${id}`, attributes);
        },
        []
    );

    const deleteDependency: StorageContext['deleteDependency'] = useCallback(
        async ({ diagramId, id }) => {
            await apiDelete(`/api/dependencies/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const listDependencies: StorageContext['listDependencies'] = useCallback(
        async (diagramId) => {
            return await apiGet<DBDependency[]>(`/api/dependencies?diagramId=${diagramId}`);
        },
        []
    );

    const deleteDiagramDependencies: StorageContext['deleteDiagramDependencies'] = useCallback(
        async (diagramId) => {
            await apiDelete(`/api/dependencies?diagramId=${diagramId}`);
        },
        []
    );

    // Area operations
    const addArea: StorageContext['addArea'] = useCallback(
        async ({ diagramId, area }) => {
            await apiPost('/api/areas', { diagramId, ...area });
        },
        []
    );

    const getArea: StorageContext['getArea'] = useCallback(
        async ({ diagramId, id }) => {
            return await apiGet<Area | undefined>(`/api/areas/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const updateArea: StorageContext['updateArea'] = useCallback(
        async ({ id, attributes }) => {
            await apiPut(`/api/areas/${id}`, attributes);
        },
        []
    );

    const deleteArea: StorageContext['deleteArea'] = useCallback(
        async ({ diagramId, id }) => {
            await apiDelete(`/api/areas/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const listAreas: StorageContext['listAreas'] = useCallback(
        async (diagramId) => {
            return await apiGet<Area[]>(`/api/areas?diagramId=${diagramId}`);
        },
        []
    );

    const deleteDiagramAreas: StorageContext['deleteDiagramAreas'] = useCallback(
        async (diagramId) => {
            await apiDelete(`/api/areas?diagramId=${diagramId}`);
        },
        []
    );

    // CustomType operations
    const addCustomType: StorageContext['addCustomType'] = useCallback(
        async ({ diagramId, customType }) => {
            await apiPost('/api/custom-types', { diagramId, ...customType });
        },
        []
    );

    const getCustomType: StorageContext['getCustomType'] = useCallback(
        async ({ diagramId, id }) => {
            return await apiGet<DBCustomType | undefined>(`/api/custom-types/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const updateCustomType: StorageContext['updateCustomType'] = useCallback(
        async ({ id, attributes }) => {
            await apiPut(`/api/custom-types/${id}`, attributes);
        },
        []
    );

    const deleteCustomType: StorageContext['deleteCustomType'] = useCallback(
        async ({ diagramId, id }) => {
            await apiDelete(`/api/custom-types/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const listCustomTypes: StorageContext['listCustomTypes'] = useCallback(
        async (diagramId) => {
            return await apiGet<DBCustomType[]>(`/api/custom-types?diagramId=${diagramId}`);
        },
        []
    );

    const deleteDiagramCustomTypes: StorageContext['deleteDiagramCustomTypes'] = useCallback(
        async (diagramId) => {
            await apiDelete(`/api/custom-types?diagramId=${diagramId}`);
        },
        []
    );

    // Notes operations
    const addNote: StorageContext['addNote'] = useCallback(
        async ({ diagramId, note }) => {
            await apiPost('/api/notes', { diagramId, ...note });
        },
        []
    );

    const getNote: StorageContext['getNote'] = useCallback(
        async ({ diagramId, id }) => {
            return await apiGet<Note | undefined>(`/api/notes/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const updateNote: StorageContext['updateNote'] = useCallback(
        async ({ id, attributes }) => {
            await apiPut(`/api/notes/${id}`, attributes);
        },
        []
    );

    const deleteNote: StorageContext['deleteNote'] = useCallback(
        async ({ diagramId, id }) => {
            await apiDelete(`/api/notes/${id}?diagramId=${diagramId}`);
        },
        []
    );

    const listNotes: StorageContext['listNotes'] = useCallback(
        async (diagramId) => {
            return await apiGet<Note[]>(`/api/notes?diagramId=${diagramId}`);
        },
        []
    );

    const deleteDiagramNotes: StorageContext['deleteDiagramNotes'] = useCallback(
        async (diagramId) => {
            await apiDelete(`/api/notes?diagramId=${diagramId}`);
        },
        []
    );

    return (
        <storageContext.Provider
            value={{
                getConfig,
                updateConfig,
                addDiagram,
                listDiagrams,
                getDiagram,
                updateDiagram,
                deleteDiagram,
                addTable,
                getTable,
                updateTable,
                putTable,
                deleteTable,
                listTables,
                addRelationship,
                getRelationship,
                updateRelationship,
                deleteRelationship,
                listRelationships,
                deleteDiagramRelationships,
                deleteDiagramTables,
                addDependency,
                getDependency,
                updateDependency,
                deleteDependency,
                listDependencies,
                deleteDiagramDependencies,
                addArea,
                getArea,
                updateArea,
                deleteArea,
                listAreas,
                deleteDiagramAreas,
                addCustomType,
                getCustomType,
                updateCustomType,
                deleteCustomType,
                listCustomTypes,
                deleteDiagramCustomTypes,
                addNote,
                getNote,
                updateNote,
                deleteNote,
                listNotes,
                deleteDiagramNotes,
                getDiagramFilter,
                updateDiagramFilter,
                deleteDiagramFilter,
            }}
        >
            {children}
        </storageContext.Provider>
    );
};
