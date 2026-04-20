import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { diagramService } from '../../services/diagram.service.js';
import { registerMcpTool } from './wrapper.js';

/**
 * Registers tools for managing Diagrams.
 */
export function registerDiagramTools(server: McpServer) {
    // List Diagrams
    registerMcpTool(
        server,
        'list_diagrams',
        'Get a list of all diagrams in the database',
        z.object({}),
        async (): Promise<CallToolResult> => {
            const diagrams = await diagramService.list();
            return {
                content: [
                    { type: 'text', text: JSON.stringify(diagrams, null, 2) },
                ],
            };
        }
    );

    // Get Diagram (with all relations)
    registerMcpTool(
        server,
        'get_diagram',
        'Get full data for a specific diagram, including tables, relationships, notes, etc.',
        z.object({
            id: z.string().describe('The ID of the diagram to retrieve'),
        }),
        async ({ id }): Promise<CallToolResult> => {
            const diagram = await diagramService.get(id, {
                tables: true,
                includeRelationships: true,
                includeDependencies: true,
                includeAreas: true,
                includeCustomTypes: true,
                includeNotes: true,
            });

            if (!diagram) {
                throw new Error('Not found');
            }

            return {
                content: [
                    { type: 'text', text: JSON.stringify(diagram, null, 2) },
                ],
            };
        }
    );

    // Create Diagram
    registerMcpTool(
        server,
        'create_diagram',
        'Create a new diagram',
        z.object({
            id: z.string().describe('Unique ID for the diagram'),
            name: z.string().describe('Diagram name'),
            databaseType: z.string().describe('e.g. PostgreSQL, MySQL, SQLite'),
            databaseEdition: z.string().optional(),
        }),
        async (data): Promise<CallToolResult> => {
            const normalizedData = {
                ...data,
                databaseType: data.databaseType.toLowerCase(),
            };
            await diagramService.create(normalizedData);
            return {
                content: [
                    { type: 'text', text: `Diagram ${data.name} created.` },
                ],
            };
        }
    );

    // Update Diagram
    registerMcpTool(
        server,
        'update_diagram',
        'Update diagram metadata',
        z.object({
            id: z.string().describe('ID of the diagram to update'),
            name: z.string().optional(),
            databaseType: z.string().optional(),
            databaseEdition: z.string().optional(),
        }),
        async ({ id, ...data }): Promise<CallToolResult> => {
            const normalizedData = {
                ...data,
                ...(data.databaseType && {
                    databaseType: data.databaseType.toLowerCase(),
                }),
            };
            await diagramService.update(id, normalizedData);
            return {
                content: [{ type: 'text', text: 'Updated successfully.' }],
            };
        }
    );

    // Delete Diagram
    registerMcpTool(
        server,
        'delete_diagram',
        'Delete a diagram and all its associated data',
        z.object({
            id: z.string().describe('ID of the diagram to delete'),
        }),
        async ({ id }): Promise<CallToolResult> => {
            await diagramService.delete(id);
            return {
                content: [{ type: 'text', text: 'Deleted successfully.' }],
            };
        }
    );
}
