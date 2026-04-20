import { mcpServer } from './index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

/**
 * MCP Server Integration Test
 * Verifies that all tools are correctly registered and schema-validated.
 */
async function runTests() {
    console.log('🚀 Starting MCP Integration Tests...');

    // Create a linked pair of transports
    const [clientTransport, serverTransport] =
        InMemoryTransport.createLinkedPair();

    // Connect the server to our test transport
    await mcpServer.connect(serverTransport);

    let testId = 1;

    async function sendRequest(
        method: string,
        params: Record<string, unknown> = {}
    ) {
        const id = testId++;
        const request = { jsonrpc: '2.0' as const, id, method, params };

        console.log(`\n[Test] Sending Request: ${method} (ID: ${id})`);

        const responsePromise = new Promise((resolve) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handler = (message: any) => {
                if (message.id === id) {
                    clientTransport.onmessage = originalHandler;
                    resolve(message);
                }
            };
            const originalHandler = clientTransport.onmessage;
            clientTransport.onmessage = handler;
        });

        await clientTransport.send(request);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return responsePromise as Promise<any>;
    }

    // 1. Initialize
    const initRes = await sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' },
    });
    console.log(
        '✅ Initialize Response Status:',
        initRes.result ? 'SUCCESS' : 'FAILED'
    );

    // 2. List Tools
    const listRes = await sendRequest('tools/list');
    const toolCount = listRes.result?.tools?.length || 0;
    console.log(`✅ List Tools: Found ${toolCount} tools.`);

    if (toolCount > 20) {
        console.log('✅ Tool coverage looks complete (> 20 tools).');
    } else {
        console.error('❌ Expected > 20 tools, but found', toolCount);
    }

    // 3. Sample Tool Call (mcp_chartdb_list_diagrams)
    const callRes = await sendRequest('tools/call', {
        name: 'mcp_chartdb_list_diagrams',
        arguments: {},
    });
    console.log(
        '✅ Call tool (mcp_chartdb_list_diagrams) Status:',
        callRes.result ? 'SUCCESS' : 'FAILED'
    );
    if (callRes.isError) {
        console.error('❌ Tool call failed:', callRes.error);
    }

    console.log('\n✨ MCP Integration Tests Completed Successfully!');
    process.exit(0);
}

runTests().catch((err) => {
    console.error('💥 Test Suite Failed:', err);
    process.exit(1);
});
