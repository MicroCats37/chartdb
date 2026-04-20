import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { filterService } from '../../services/filter.service.js';
import { registerMcpTool } from './wrapper.js';

/**
 * Registers tools for managing Filters.
 */
export function registerFilterTools(server: McpServer) {
    // Get Diagram Filters
    registerMcpTool(
        server,
        'get_diagram_filters',
        'Get visibility filters for a diagram',
        z.object({ diagramId: z.string() }),
        async ({ diagramId }): Promise<CallToolResult> => {
            const filter = await filterService.get(diagramId);
            return {
                content: [
                    { type: 'text', text: JSON.stringify(filter, null, 2) },
                ],
            };
        }
    );

    // Update Diagram Filters
    registerMcpTool(
        server,
        'update_diagram_filters',
        'Update visibility filters (schema/table IDs)',
        z.object({
            diagramId: z.string(),
            schemaIds: z.string().optional().describe('JSON stringified'),
            tableIds: z.string().optional().describe('JSON stringified'),
        }),
        async ({ diagramId, schemaIds, tableIds }): Promise<CallToolResult> => {
            // Parse JSON stringified fields
            const parsedSchemaIds = schemaIds
                ? JSON.parse(schemaIds)
                : undefined;
            const parsedTableIds = tableIds ? JSON.parse(tableIds) : undefined;

            await filterService.update(diagramId, {
                schemaIds: parsedSchemaIds,
                tableIds: parsedTableIds,
            });
            return { content: [{ type: 'text', text: 'Filters updated.' }] };
        }
    );
}
