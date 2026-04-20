import prisma from './server/src/db.js';

async function main() {
    const dCount = await prisma.diagram.count();
    if (dCount === 0) {
        const _d = await prisma.diagram.create({
            data: {
                id: 'default',
                name: 'Main Diagram',
                databaseType: 'sqlite',
            },
        });
        await prisma.chartDBConfig.upsert({
            where: { id: 1 },
            create: { id: 1, defaultDiagramId: 'default' },
            update: { defaultDiagramId: 'default' },
        });
        console.log(
            'Bootstrap success: Created default diagram (id: default).'
        );
    } else {
        console.log('Database already has diagrams. No bootstrap needed.');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
