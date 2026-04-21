import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaLibSql } from '@prisma/adapter-libsql';

const config = {
    url: process.env.DATABASE_URL || 'file:./server/dev.db',
};

const adapter = new PrismaLibSql(config);
const prisma = new PrismaClient({ adapter });

export default prisma;
