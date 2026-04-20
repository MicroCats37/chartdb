import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAllTools } from './tools/index.js';

/**
 * Initializes and configures the ChartDB MCP Server.
 */

// Instantiate the MCP Server
export const mcpServer = new McpServer({
    name: 'chartdb-mcp',
    version: '1.0.0',
});

// Register all modular tools
registerAllTools(mcpServer);
