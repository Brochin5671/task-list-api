import { z } from 'zod';
import { GraphQLError } from 'graphql';
import { builder } from './builder.js';

builder.prismaObject('Task', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    completed: t.exposeBoolean('completed'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});

builder.queryType({
  fields: (t) => ({
    tasks: t.prismaField({
      type: ['Task'],
      resolve: (query, _root, _args, ctx) =>
        ctx.prisma.task.findMany({
          ...query,
          orderBy: { createdAt: 'desc' },
        }),
    }),
    task: t.prismaField({
      type: 'Task',
      nullable: true,
      args: {
        id: t.arg.id({
          required: true,
          validate: { schema: z.cuid2() },
        }),
      },
      resolve: async (query, _root, args, ctx) => {
        const task = await ctx.prisma.task.findUnique({
          ...query,
          where: { id: String(args.id) },
        });
        if (!task) {
          throw new GraphQLError('Task not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        return task;
      },
    }),
  }),
});
