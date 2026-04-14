import { Router } from 'express';
import { diagramsRouter } from './diagrams.js';
import { tablesRouter } from './tables.js';
import { relationshipsRouter } from './relationships.js';
import { dependenciesRouter } from './dependencies.js';
import { areasRouter } from './areas.js';
import { customTypesRouter } from './custom-types.js';
import { notesRouter } from './notes.js';
import { configRouter } from './config.js';
import { diagramFiltersRouter } from './diagram-filters.js';

export const apiRouter = Router();

apiRouter.use('/diagrams', diagramsRouter);
apiRouter.use('/tables', tablesRouter);
apiRouter.use('/relationships', relationshipsRouter);
apiRouter.use('/dependencies', dependenciesRouter);
apiRouter.use('/areas', areasRouter);
apiRouter.use('/custom-types', customTypesRouter);
apiRouter.use('/notes', notesRouter);
apiRouter.use('/config', configRouter);
apiRouter.use('/diagram-filters', diagramFiltersRouter);
