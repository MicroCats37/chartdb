const { spawn } = require('child_process');

// Simulamos lo que hace OpenCode internamente
const mcpProcess = spawn(
    'docker',
    [
        'exec',
        '-i',
        '-e',
        'NODE_NO_WARNINGS=1',
        'chartdb-backend',
        'npx',
        'tsx',
        'server/src/mcp/stdio-entry.ts',
    ],
    { stdio: ['pipe', 'pipe', 'pipe'] }
);

let _output = '';

mcpProcess.stdout.on('data', (data) => {
    const message = data.toString();
    _output += message;

    console.log('\n📥 RECIBIDO DEL MCP:');
    console.log(
        message.substring(0, 500) +
            (message.length > 500 ? '...\n(Mensaje cortado por longitud)' : '')
    );

    // Si el MCP acepta nuestra inicialización, le pedimos la lista de herramientas
    if (message.includes('"serverInfo"')) {
        console.log(
            '✅ El servidor aceptó la conexión. Pidiendo lista de herramientas...'
        );
        const listToolsReq =
            JSON.stringify({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/list',
                params: {},
            }) + '\n';
        mcpProcess.stdin.write(listToolsReq);
    }

    // Si el MCP nos responde con la lista de herramientas, cerramos con éxito
    if (
        message.includes('"tools"') &&
        message.includes('chartdb_create_diagram')
    ) {
        console.log(
            '\n🚀 ¡ÉXITO ROTUNDO! El MCP entregó la lista de herramientas correctamente. Todo funciona al 100%.'
        );
        mcpProcess.kill();
        process.exit(0);
    }
});

mcpProcess.stderr.on('data', (data) => {
    console.error('⚠️ Error/Log del contenedor:', data.toString());
});

// Paso 1: Iniciamos la conversación (Handshake) con el protocolo MCP
console.log(
    '🔌 Conectando al contenedor Docker de ChartDB y arrancando el MCP por Stdio...\n'
);
const initReq =
    JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'mi-script-de-prueba', version: '1.0.0' },
        },
    }) + '\n';

mcpProcess.stdin.write(initReq);

// Timeout de seguridad
setTimeout(() => {
    console.log('❌ Timeout: El servidor no respondió a tiempo.');
    mcpProcess.kill();
    process.exit(1);
}, 8000);
