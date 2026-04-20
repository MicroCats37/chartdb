import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';
import { mcpLogger } from '../logger.js';

/**
 * JSON-RPC error object structure.
 */
type JsonRpcError = {
    jsonrpc: '2.0';
    error: {
        code: number;
        message: string;
    };
};

/**
 * JSON-RPC error codes following the JSON-RPC 2.0 specification.
 */
enum JsonRpcErrorCode {
    InternalError = -32603,
}

/**
 * Handler type for MCP tools.
 * The handler receives typed input and returns a CallToolResult.
 */
type ToolHandler<T> = (args: T) => Promise<CallToolResult>;

/**
 * Registers an MCP tool with standardized naming, strict typing, and JSON-RPC error handling.
 *
 * - Auto-prefixes tool names with `mcp_chartdb_`
 * - Validates input against the provided Zod schema (handled by SDK)
 * - Catches and formats execution errors as JSON-RPC compliant error responses
 *
 * @param server - The MCP server instance to register the tool with
 * @param name - The base tool name (will be prefixed with `mcp_chartdb_`)
 * @param description - Human-readable description of what the tool does
 * @param schema - Zod schema for input validation and type inference
 * @param handler - Async function that receives parsed, typed input and returns CallToolResult
 */
export function registerMcpTool<T extends z.ZodObject<z.ZodRawShape>>(
    server: McpServer,
    name: string,
    description: string,
    schema: T,
    handler: ToolHandler<z.infer<T>>
): void {
    const prefixedName = `mcp_chartdb_${name}`;

    // Register with original name (agnostic)
    const names = [name, prefixedName];

    for (const toolName of names) {
        server.registerTool(
            toolName,
            {
                description,
                inputSchema: schema.shape,
            },
            async (input: z.infer<T> & { _meta?: unknown }) => {
                mcpLogger.toolCall(toolName, input);

                try {
                    // Parse and validate input with Zod
                    const parsedData = schema.parse(input);

                    // Execute the handler with the parsed data
                    const result = await handler(parsedData);

                    mcpLogger.toolResult(toolName, result);
                    return result;
                } catch (error) {
                    // Handle execution errors as JSON-RPC error response
                    const errorMessage =
                        error instanceof Error ? error.message : String(error);

                    const executionError: JsonRpcError = {
                        jsonrpc: '2.0',
                        error: {
                            code: JsonRpcErrorCode.InternalError,
                            message: errorMessage,
                        },
                    };

                    const fail: CallToolResult = {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(executionError),
                            },
                        ],
                        isError: true,
                    };

                    mcpLogger.toolResult(toolName, fail);
                    return fail;
                }
            }
        );
    }
}
