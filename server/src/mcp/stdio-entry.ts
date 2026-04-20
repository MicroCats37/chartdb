import { mcpServer } from './index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const transport = new StdioServerTransport();
mcpServer
    .connect(transport)
    .then(() => {
        console.log('ChartDB MCP Server connected via stdio');
    })
    .catch((error) => {
        console.error('Failed to start ChartDB MCP Server:', error);
    });
