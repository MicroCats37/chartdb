import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { configService } from '../../services/config.service.js';
import { registerMcpTool } from './wrapper.js';

/**
 * Registers tools for managing ChartDB Config.
 */
export function registerConfigTools(server: McpServer) {
    // Get Config
    registerMcpTool(
        server,
        'get_config',
        'Get the ChartDB application configuration',
        z.object({}),
        async (): Promise<CallToolResult> => {
            const config = await configService.get();
            if (!config) {
                return {
                    content: [{ type: 'text', text: 'No config found.' }],
                };
            }
            return {
                content: [
                    { type: 'text', text: JSON.stringify(config, null, 2) },
                ],
            };
        }
    );

    // Update Config
    registerMcpTool(
        server,
        'update_config',
        'Update the ChartDB application configuration',
        z.object({
            defaultDiagramId: z
                .string()
                .optional()
                .describe('ID of the default diagram to load'),
            exportActions: z
                .string()
                .optional()
                .describe('JSON stringified array of export actions'),
        }),
        async ({
            defaultDiagramId,
            exportActions,
        }): Promise<CallToolResult> => {
            // Parse JSON stringified exportActions if provided
            const parsedExportActions = exportActions
                ? JSON.parse(exportActions)
                : undefined;

            await configService.update({
                defaultDiagramId,
                exportActions: parsedExportActions,
            });
            return {
                content: [{ type: 'text', text: 'Config updated.' }],
            };
        }
    );
}
