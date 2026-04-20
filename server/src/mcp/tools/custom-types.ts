import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { customTypeService } from '../../services/custom-type.service.js';
import { registerMcpTool } from './wrapper.js';

/**
 * Registers tools for managing Custom Types.
 */
export function registerCustomTypeTools(server: McpServer) {
    // Create Custom Type
    registerMcpTool(
        server,
        'create_custom_type',
        'Create a custom database type',
        z.object({
            id: z.string(),
            diagramId: z.string(),
            name: z.string(),
            kind: z.string().describe('e.g. enum, domain, etc.'),
            values: z
                .string()
                .optional()
                .describe('JSON stringified array of values'),
            fields: z
                .string()
                .optional()
                .describe('JSON stringified array of fields'),
            schema: z.string().optional(),
        }),
        async (data): Promise<CallToolResult> => {
            // Parse JSON stringified fields
            const parsedValues = data.values
                ? JSON.parse(data.values)
                : undefined;
            const parsedFields = data.fields
                ? JSON.parse(data.fields)
                : undefined;

            await customTypeService.create({
                id: data.id,
                diagramId: data.diagramId,
                name: data.name,
                kind: data.kind as 'enum' | 'composite',
                values: parsedValues,
                fields: parsedFields,
                schema: data.schema,
            });

            return {
                content: [{ type: 'text', text: 'Custom type created.' }],
            };
        }
    );

    // Update Custom Type
    registerMcpTool(
        server,
        'update_custom_type',
        'Update a custom type',
        z.object({
            id: z.string(),
            name: z.string().optional(),
            kind: z.string().optional(),
            values: z.string().optional(),
            fields: z.string().optional(),
            schema: z.string().optional(),
        }),
        async ({ id, ...data }): Promise<CallToolResult> => {
            // Parse JSON stringified fields
            const parsedValues = data.values
                ? JSON.parse(data.values)
                : undefined;
            const parsedFields = data.fields
                ? JSON.parse(data.fields)
                : undefined;

            const updateData: Record<string, unknown> = { ...data };
            if (parsedValues !== undefined) updateData.values = parsedValues;
            if (parsedFields !== undefined) updateData.fields = parsedFields;

            await customTypeService.update(id, updateData);
            return {
                content: [{ type: 'text', text: 'Custom type updated.' }],
            };
        }
    );

    // Delete Custom Type
    registerMcpTool(
        server,
        'delete_custom_type',
        'Delete a custom type',
        z.object({ id: z.string() }),
        async ({ id }): Promise<CallToolResult> => {
            await customTypeService.delete(id);
            return {
                content: [{ type: 'text', text: 'Custom type deleted.' }],
            };
        }
    );
}
