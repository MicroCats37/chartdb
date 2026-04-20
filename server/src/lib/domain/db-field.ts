import { z } from 'zod';
import { dataTypeSchema } from '../data/data-types/data-types.js';

export interface DBField {
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
}

export const dbFieldSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: dataTypeSchema,
    primaryKey: z.boolean(),
    unique: z.boolean(),
    nullable: z.boolean(),
    increment: z.boolean().or(z.null()).optional(),
    isArray: z.boolean().or(z.null()).optional(),
    createdAt: z.number(),
    characterMaximumLength: z.string().or(z.null()).optional(),
    precision: z.number().or(z.null()).optional(),
    scale: z.number().or(z.null()).optional(),
    default: z.string().or(z.null()).optional(),
    collation: z.string().or(z.null()).optional(),
    comments: z.string().or(z.null()).optional(),
    check: z.string().or(z.null()).optional(),
});
