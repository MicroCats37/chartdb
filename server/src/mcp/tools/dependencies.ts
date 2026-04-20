import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { dependencyService } from '../../services/dependency.service.js';
import { registerMcpTool } from './wrapper.js';

/**
 * Registers tools for managing Dependencies.
 */
export function registerDependencyTools(server: McpServer) {
    // Create Dependency
    registerMcpTool(
        server,
        'create_dependency',
        'Create a dependency link between two tables',
        z.object({
            id: z.string(),
            diagramId: z.string(),
            tableId: z.string(),
            dependentTableId: z.string(),
            schema: z.string().optional(),
            dependentSchema: z.string().optional(),
        }),
        async (data): Promise<CallToolResult> => {
            await dependencyService.create({
                ...data,
                createdAt: Date.now(),
            });
            return { content: [{ type: 'text', text: 'Dependency created.' }] };
        }
    );

    // Delete Dependency
    registerMcpTool(
        server,
        'delete_dependency',
        'Delete a dependency',
        z.object({ id: z.string() }),
        async ({ id }): Promise<CallToolResult> => {
            await dependencyService.delete(id);
            return { content: [{ type: 'text', text: 'Dependency deleted.' }] };
        }
    );
}
