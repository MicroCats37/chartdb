import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDiagramTools } from './diagrams.js';
import { registerTableTools } from './tables.js';
import { registerRelationshipTools } from './relationships.js';
import { registerNoteTools } from './notes.js';
import { registerDependencyTools } from './dependencies.js';
import { registerAreaTools } from './areas.js';
import { registerCustomTypeTools } from './custom-types.js';
import { registerConfigTools } from './config.js';
import { registerFilterTools } from './filters.js';

/**
 * Registers all domain-specific tools into the MCP server instance.
 */
export function registerAllTools(server: McpServer) {
    registerDiagramTools(server);
    registerTableTools(server);
    registerRelationshipTools(server);
    registerNoteTools(server);
    registerDependencyTools(server);
    registerAreaTools(server);
    registerCustomTypeTools(server);
    registerConfigTools(server);
    registerFilterTools(server);
}
