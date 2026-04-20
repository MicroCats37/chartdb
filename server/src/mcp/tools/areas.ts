import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { areaService } from '../../services/area.service.js';
import { registerMcpTool } from './wrapper.js';

/**
 * Registers tools for managing Areas.
 */
export function registerAreaTools(server: McpServer) {
    // Create Area
    registerMcpTool(
        server,
        'create_area',
        'Create a visual area in a diagram',
        z.object({
            id: z.string(),
            diagramId: z.string(),
            name: z.string(),
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number(),
            color: z.string(),
        }),
        async (data): Promise<CallToolResult> => {
            await areaService.create(data);
            return { content: [{ type: 'text', text: 'Area created.' }] };
        }
    );

    // Update Area
    registerMcpTool(
        server,
        'update_area',
        'Update an area',
        z.object({
            id: z.string(),
            name: z.string().optional(),
            x: z.number().optional(),
            y: z.number().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
            color: z.string().optional(),
        }),
        async ({ id, ...data }): Promise<CallToolResult> => {
            await areaService.update(id, data);
            return { content: [{ type: 'text', text: 'Area updated.' }] };
        }
    );

    // Delete Area
    registerMcpTool(
        server,
        'delete_area',
        'Delete an area',
        z.object({ id: z.string() }),
        async ({ id }): Promise<CallToolResult> => {
            await areaService.delete(id);
            return { content: [{ type: 'text', text: 'Area deleted.' }] };
        }
    );
}
