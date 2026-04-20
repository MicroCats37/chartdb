import { z } from 'zod';
import { dbIndexSchema } from './db-index.js';
import { dbFieldSchema } from './db-field.js';
import { dbCheckConstraintSchema } from './db-check-constraint.js';
import { schemaNameToDomainSchemaName } from './db-schema.js';

export const MAX_TABLE_SIZE = 450;
export const MID_TABLE_SIZE = 337;
export const MIN_TABLE_SIZE = 224;
export const TABLE_MINIMIZED_FIELDS = 10;

export interface DBTable {
    id: string;
    name: string;
    schema?: string | null;
    x: number;
    y: number;
    fields: {
        id: string;
        name: string;
        type: { id: string; name: string };
        primaryKey: boolean;
        unique: boolean;
        nullable: boolean;
        increment?: boolean | null;
        isArray?: boolean | null;
        createdAt: number;
        characterMaximumLength?: string | null;
        precision?: number | null;
        scale?: number | null;
        default?: string | null;
        collation?: string | null;
        comments?: string | null;
        check?: string | null;
    }[];
    indexes: {
        id: string;
        name: string;
        unique: boolean;
        fieldIds: string[];
        createdAt: number;
        type?: string | null;
        isPrimaryKey?: boolean | null;
        comments?: string | null;
    }[];
    checkConstraints?:
        | { id: string; expression: string; createdAt: number }[]
        | null;
    color: string;
    isView: boolean;
    isMaterializedView?: boolean | null;
    createdAt: number;
    width?: number | null;
    comments?: string | null;
    order?: number | null;
    expanded?: boolean | null;
    parentAreaId?: string | null;
}

export const dbTableSchema = z.object({
    id: z.string(),
    name: z.string(),
    schema: z.string().or(z.null()).optional(),
    x: z.number(),
    y: z.number(),
    fields: z.array(dbFieldSchema),
    indexes: z.array(dbIndexSchema),
    checkConstraints: z.array(dbCheckConstraintSchema).or(z.null()).optional(),
    color: z.string(),
    isView: z.boolean(),
    isMaterializedView: z.boolean().or(z.null()).optional(),
    createdAt: z.number(),
    width: z.number().or(z.null()).optional(),
    comments: z.string().or(z.null()).optional(),
    order: z.number().or(z.null()).optional(),
    expanded: z.boolean().or(z.null()).optional(),
    parentAreaId: z.string().or(z.null()).optional(),
});

export const generateTableKey = ({
    schemaName,
    tableName,
}: {
    schemaName: string | null | undefined;
    tableName: string;
}) => `${schemaNameToDomainSchemaName(schemaName) ?? ''}.${tableName}`;

export const calcTableHeight = (table?: DBTable): number => {
    if (!table) {
        return 300;
    }

    const FIELD_HEIGHT = 32;
    const TABLE_FOOTER_HEIGHT = 32;
    const TABLE_HEADER_HEIGHT = 42;
    const fieldCount = table.fields.length;
    let visibleFieldCount = fieldCount;

    if (!table.expanded) {
        visibleFieldCount = Math.min(fieldCount, TABLE_MINIMIZED_FIELDS);
    }

    const fieldsHeight = visibleFieldCount * FIELD_HEIGHT;
    const showMoreButtonHeight =
        fieldCount > TABLE_MINIMIZED_FIELDS ? TABLE_FOOTER_HEIGHT : 0;

    return TABLE_HEADER_HEIGHT + fieldsHeight + showMoreButtonHeight;
};

export const getTableDimensions = (
    table: DBTable
): { width: number; height: number } => {
    const height = calcTableHeight(table);
    const width = table.width || MIN_TABLE_SIZE;
    return { width, height };
};
