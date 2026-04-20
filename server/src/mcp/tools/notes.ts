import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { noteService } from '../../services/note.service.js';
import { registerMcpTool } from './wrapper.js';

/**
 * Registers tools for managing Notes.
 */
export function registerNoteTools(server: McpServer) {
    // Create Note
    registerMcpTool(
        server,
        'create_note',
        'Create a note in a diagram',
        z.object({
            id: z.string(),
            diagramId: z.string(),
            content: z.string(),
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number(),
            color: z.string(),
        }),
        async (data): Promise<CallToolResult> => {
            await noteService.create(data);
            return { content: [{ type: 'text', text: 'Note created.' }] };
        }
    );

    // Update Note
    registerMcpTool(
        server,
        'update_note',
        'Update a note',
        z.object({
            id: z.string(),
            content: z.string().optional(),
            x: z.number().optional(),
            y: z.number().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
            color: z.string().optional(),
        }),
        async ({ id, ...data }): Promise<CallToolResult> => {
            await noteService.update(id, data);
            return { content: [{ type: 'text', text: 'Note updated.' }] };
        }
    );

    // Delete Note
    registerMcpTool(
        server,
        'delete_note',
        'Delete a note',
        z.object({ id: z.string() }),
        async ({ id }): Promise<CallToolResult> => {
            await noteService.delete(id);
            return { content: [{ type: 'text', text: 'Note deleted.' }] };
        }
    );
}
