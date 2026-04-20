/**
 * Internal logger for MCP tool executions.
 * Provides consistent console output for monitoring agentic actions.
 */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export const mcpLogger = {
    info: (message: string, data?: unknown) => {
        console.error(
            `[MCP] INFO: ${message}`,
            data ? JSON.stringify(data, null, 2) : ''
        );
    },
    error: (message: string, error?: unknown) => {
        console.error(`[MCP] ERROR: ${message}`, error);
    },
    toolCall: (toolName: string, args: unknown) => {
        console.error(
            `[MCP] TOOL CALL: ${toolName}`,
            JSON.stringify(args, null, 2)
        );
    },
    toolResult: (toolName: string, result: CallToolResult) => {
        const status = result.isError ? 'FAILED' : 'SUCCESS';
        console.error(`[MCP] TOOL RESULT: ${toolName} -> ${status}`);
    },
};
