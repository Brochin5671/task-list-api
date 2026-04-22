import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import ZodPlugin from '@pothos/plugin-zod';
import { DateTimeResolver } from 'graphql-scalars';
import { GraphQLError } from 'graphql';
import type PrismaTypes from '../generated/pothos-types.js';
import { getDatamodel } from '../generated/pothos-types.js';
import { prisma } from '../db.js';
import type { Context } from '../context.js';

export const builder = new SchemaBuilder<{
  Context: Context;
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin, ZodPlugin],
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
  },
  zod: {
    validationError: (zodError) =>
      new GraphQLError('Invalid input', {
        extensions: {
          code: 'BAD_USER_INPUT',
          issues: zodError.issues,
        },
      }),
  },
});

builder.addScalarType('DateTime', DateTimeResolver);
