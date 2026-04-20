import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { tableService } from '../../services/table.service.js';
import { registerMcpTool } from './wrapper.js';

/**
 * Registers tools for managing Tables.
 */
export function registerTableTools(server: McpServer) {
    // Create Table
    registerMcpTool(
        server,
        'create_table',
        'Create a new table in a diagram',
        z.object({
            id: z.string(),
            diagramId: z.string(),
            name: z.string(),
            x: z.number(),
            y: z.number(),
            color: z.string(),
            fields: z.string().describe('JSON stringified array of fields'),
            schema: z.string().optional(),
            indexes: z.string().optional().default('[]'),
            isView: z.boolean().optional().default(false),
            width: z.number().optional(),
            comments: z.string().optional(),
            expanded: z.boolean().optional().default(true),
            checkConstraints: z.string().optional(),
            createdAt: z.number().optional(),
        }),
        async (data): Promise<CallToolResult> => {
            // Parse JSON stringified fields
            const parsedFields = JSON.parse(data.fields);

            // Normalize fields: convert string types to { id, name } and apply defaults
            const normalizedFields = parsedFields.map(
                (field: {
                    type: string | { id: string; name: string };
                    [key: string]: unknown;
                }) => {
                    const normalizedType =
                        typeof field.type === 'string'
                            ? { id: field.type, name: field.type }
                            : field.type;

                    return {
                        ...field,
                        type: normalizedType,
                        primaryKey: field.primaryKey ?? false,
                        unique: field.unique ?? false,
                        nullable: field.nullable ?? false,
                        createdAt: field.createdAt ?? Date.now(),
                        updatedAt: field.updatedAt ?? Date.now(),
                    };
                }
            );

            // Parse indexes if provided
            const parsedIndexes = data.indexes ? JSON.parse(data.indexes) : [];

            // Parse checkConstraints if provided
            const parsedCheckConstraints = data.checkConstraints
                ? JSON.parse(data.checkConstraints)
                : undefined;

            await tableService.create({
                id: data.id,
                diagramId: data.diagramId,
                name: data.name,
                x: data.x,
                y: data.y,
                color: data.color || '#ffffff',
                fields: normalizedFields,
                indexes: parsedIndexes,
                checkConstraints: parsedCheckConstraints,
                schema: data.schema,
                isView: data.isView ?? false,
                width: data.width,
                comments: data.comments,
                expanded: data.expanded ?? true,
                createdAt: data.createdAt || Date.now(),
            });

            return {
                content: [
                    { type: 'text', text: `Table ${data.name} created.` },
                ],
            };
        }
    );

    // Update Table
    registerMcpTool(
        server,
        'update_table',
        'Update an existing table',
        z.object({
            id: z.string(),
            name: z.string().optional(),
            x: z.number().optional(),
            y: z.number().optional(),
            color: z.string().optional(),
            fields: z.string().optional(),
            indexes: z.string().optional(),
            isView: z.boolean().optional(),
            width: z.number().optional(),
            comments: z.string().optional(),
            expanded: z.boolean().optional(),
            checkConstraints: z.string().optional(),
        }),
        async ({ id, ...data }): Promise<CallToolResult> => {
            // Build update data with parsed fields
            const updateData: Record<string, unknown> = { ...data };

            if (data.fields) {
                const parsedFields = JSON.parse(data.fields);
                const normalizedFields = parsedFields.map(
                    (field: {
                        type: string | { id: string; name: string };
                        [key: string]: unknown;
                    }) => {
                        const normalizedType =
                            typeof field.type === 'string'
                                ? { id: field.type, name: field.type }
                                : field.type;

                        return {
                            ...field,
                            type: normalizedType,
                            primaryKey: field.primaryKey ?? false,
                            unique: field.unique ?? false,
                            nullable: field.nullable ?? false,
                            createdAt: field.createdAt ?? Date.now(),
                            updatedAt: field.updatedAt ?? Date.now(),
                        };
                    }
                );
                updateData.fields = normalizedFields;
            }

            if (data.indexes) {
                updateData.indexes = JSON.parse(data.indexes);
            }

            if (data.checkConstraints !== undefined) {
                updateData.checkConstraints = data.checkConstraints
                    ? JSON.parse(data.checkConstraints)
                    : null;
            }

            await tableService.update(id, updateData);
            return { content: [{ type: 'text', text: 'Table updated.' }] };
        }
    );

    // Delete Table
    registerMcpTool(
        server,
        'delete_table',
        'Delete a table',
        z.object({ id: z.string() }),
        async ({ id }): Promise<CallToolResult> => {
            await tableService.delete(id);
            return { content: [{ type: 'text', text: 'Table deleted.' }] };
        }
    );
}
