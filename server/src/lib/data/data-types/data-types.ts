import { z } from 'zod';
import { DatabaseType } from '../../domain/database-type.js';
import { databaseSupportsArrays } from '../../domain/database-capabilities.js';

export type DataType = {
    id: string;
    name: string;
};

export interface FieldAttributeRange {
    max: number;
    min: number;
    default: number;
}

interface FieldAttributes {
    hasCharMaxLength?: boolean;
    hasCharMaxLengthOption?: boolean;
    precision?: FieldAttributeRange;
    scale?: FieldAttributeRange;
    maxLength?: number;
}

export type DataTypeData = DataType & {
    usageLevel?: 1 | 2;
    fieldAttributes?: FieldAttributes;
};

export const dataTypeSchema = z.object({
    id: z.string(),
    name: z.string(),
});

// Placeholder - the actual data types are database-specific
// For validation purposes, we just need the schema structure
export const dataTypeMap: Record<DatabaseType, readonly DataTypeData[]> = {
    [DatabaseType.GENERIC]: [],
    [DatabaseType.POSTGRESQL]: [],
    [DatabaseType.MYSQL]: [],
    [DatabaseType.SQL_SERVER]: [],
    [DatabaseType.MARIADB]: [],
    [DatabaseType.SQLITE]: [],
    [DatabaseType.CLICKHOUSE]: [],
    [DatabaseType.COCKROACHDB]: [],
    [DatabaseType.ORACLE]: [],
} as const;

export const dataTypes = Object.values(dataTypeMap).flat();

export const findDataTypeDataById = (
    id: string,
    databaseType?: DatabaseType
): DataTypeData | undefined => {
    const dataTypesOptions = databaseType
        ? dataTypeMap[databaseType]
        : dataTypes;

    return dataTypesOptions.find((dataType) => dataType.id === id);
};

export const supportsAutoIncrementDataType = (
    dataTypeName: string
): boolean => {
    return [
        'integer',
        'int',
        'bigint',
        'smallint',
        'tinyint',
        'mediumint',
        'serial',
        'bigserial',
        'smallserial',
        'number',
        'numeric',
        'decimal',
    ].includes(dataTypeName.toLocaleLowerCase());
};

export const autoIncrementAlwaysOn = (dataTypeName: string): boolean => {
    return ['serial', 'bigserial', 'smallserial'].includes(
        dataTypeName.toLowerCase()
    );
};

export const requiresNotNull = (dataTypeName: string): boolean => {
    return ['serial', 'bigserial', 'smallserial'].includes(
        dataTypeName.toLowerCase()
    );
};

const ARRAY_INCOMPATIBLE_TYPES = [
    'serial',
    'bigserial',
    'smallserial',
] as const;

export const supportsArrayDataType = (
    dataTypeName: string,
    databaseType: DatabaseType
): boolean => {
    if (!databaseSupportsArrays(databaseType)) {
        return false;
    }

    return !ARRAY_INCOMPATIBLE_TYPES.includes(
        dataTypeName.toLowerCase() as (typeof ARRAY_INCOMPATIBLE_TYPES)[number]
    );
};
