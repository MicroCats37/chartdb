import express from 'express';
import 'dotenv/config'; // Forced reload trigger 🚀
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './routes/index.js';

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { mcpServer } from './mcp/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MCP Server Setup
const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // Stateless mode
});

// Connect once at startup
await mcpServer.connect(transport);

// MCP Server Endpoint
app.post('/mcp', async (req, res) => {
    try {
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('[MCP] Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use('/api', apiRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// Global error handler
import type { Request, Response, NextFunction } from 'express';
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`ChartDB server running on port ${port}`);
});
// Trigger restart
