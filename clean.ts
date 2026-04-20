import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./server/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('--- RESETTING DATABASE ---');

    // order is important because of possible FKs (though we have Cascade)
    console.log('Cleaning DBRelationship...');
    await prisma.dBRelationship.deleteMany();

    console.log('Cleaning DBTable...');
    await prisma.dBTable.deleteMany();

    console.log('Cleaning Diagram...');
    await prisma.diagram.deleteMany();

    console.log('Cleaning Area...');
    await prisma.area.deleteMany();

    console.log('Cleaning Note...');
    await prisma.note.deleteMany();

    console.log('Cleaning DiagramFilter...');
    await prisma.diagramFilter.deleteMany();

    console.log('--- DATABASE CLEANED SUCCESSFULLY ---');
}

main()
    .catch((e) => {
        console.error('Error cleaning database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
