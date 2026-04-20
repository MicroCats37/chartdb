import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { relationshipService } from '../../services/relationship.service.js';
import { registerMcpTool } from './wrapper.js';

/**
 * Registers tools for managing Relationships.
 */
export function registerRelationshipTools(server: McpServer) {
    // Create Relationship
    registerMcpTool(
        server,
        'create_relationship',
        'Create a relationship between two tables',
        z.object({
            id: z.string(),
            diagramId: z.string(),
            name: z.string(),
            sourceTableId: z.string(),
            targetTableId: z.string(),
            sourceFieldId: z.string(),
            targetFieldId: z.string(),
            sourceCardinality: z.string().describe('e.g. 1, n'),
            targetCardinality: z.string().describe('e.g. 1, n'),
            sourceSchema: z.string().optional(),
            targetSchema: z.string().optional(),
        }),
        async (data): Promise<CallToolResult> => {
            await relationshipService.create({
                ...data,
                createdAt: Date.now(),
            });
            return {
                content: [{ type: 'text', text: 'Relationship created.' }],
            };
        }
    );

    // Update Relationship
    registerMcpTool(
        server,
        'update_relationship',
        'Update relationship properties',
        z.object({
            id: z.string(),
            name: z.string().optional(),
            sourceTableId: z.string().optional(),
            targetTableId: z.string().optional(),
            sourceFieldId: z.string().optional(),
            targetFieldId: z.string().optional(),
            sourceCardinality: z.string().optional(),
            targetCardinality: z.string().optional(),
            sourceSchema: z.string().optional(),
            targetSchema: z.string().optional(),
        }),
        async ({ id, ...data }): Promise<CallToolResult> => {
            await relationshipService.update(id, data);
            return {
                content: [{ type: 'text', text: 'Relationship updated.' }],
            };
        }
    );

    // Delete Relationship
    registerMcpTool(
        server,
        'delete_relationship',
        'Delete a relationship',
        z.object({ id: z.string() }),
        async ({ id }): Promise<CallToolResult> => {
            await relationshipService.delete(id);
            return {
                content: [{ type: 'text', text: 'Relationship deleted.' }],
            };
        }
    );
}
