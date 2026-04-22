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

const AddTaskInput = builder.inputType('AddTaskInput', {
  fields: (t) => ({
    title: t.string({
      required: true,
      validate: { schema: z.string().trim().min(1).max(255) },
    }),
  }),
});

const UpdateTaskInput = builder.inputType('UpdateTaskInput', {
  fields: (t) => ({
    title: t.string({
      required: false,
      validate: { schema: z.string().trim().min(1).max(255) },
    }),
    completed: t.boolean({ required: false }),
  }),
  validate: {
    schema: z
      .object({ title: z.string().optional(), completed: z.boolean().optional() })
      .refine((v) => v.title !== undefined || v.completed !== undefined, {
        message: 'At least one field must be provided',
      }),
  },
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

builder.mutationType({
  fields: (t) => ({
    addTask: t.prismaField({
      type: 'Task',
      args: {
        input: t.arg({ type: AddTaskInput, required: true }),
      },
      resolve: (query, _root, args, ctx) =>
        ctx.prisma.task.create({
          ...query,
          data: { title: args.input.title.trim() },
        }),
    }),
    toggleTask: t.prismaField({
      type: 'Task',
      args: {
        id: t.arg.id({
          required: true,
          validate: { schema: z.cuid2() },
        }),
      },
      resolve: async (query, _root, args, ctx) => {
        const id = String(args.id);
        const existing = await ctx.prisma.task.findUnique({
          where: { id },
          select: { completed: true },
        });
        if (!existing) {
          throw new GraphQLError('Task not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        return ctx.prisma.task.update({
          ...query,
          where: { id },
          data: { completed: !existing.completed },
        });
      },
    }),
    deleteTask: t.prismaField({
      type: 'Task',
      args: {
        id: t.arg.id({
          required: true,
          validate: { schema: z.cuid2() },
        }),
      },
      resolve: async (query, _root, args, ctx) => {
        const id = String(args.id);
        const existing = await ctx.prisma.task.findUnique({
          where: { id },
          select: { id: true },
        });
        if (!existing) {
          throw new GraphQLError('Task not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        return ctx.prisma.task.delete({ ...query, where: { id } });
      },
    }),
    updateTask: t.prismaField({
      type: 'Task',
      args: {
        id: t.arg.id({
          required: true,
          validate: { schema: z.cuid2() },
        }),
        input: t.arg({ type: UpdateTaskInput, required: true }),
      },
      resolve: async (query, _root, args, ctx) => {
        const id = String(args.id);
        const existing = await ctx.prisma.task.findUnique({
          where: { id },
          select: { id: true },
        });
        if (!existing) {
          throw new GraphQLError('Task not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
        const title = args.input.title?.trim();
        const completed = args.input.completed ?? undefined;
        return ctx.prisma.task.update({
          ...query,
          where: { id },
          data: {
            ...(title !== undefined && { title }),
            ...(completed !== undefined && { completed }),
          },
        });
      },
    }),
    clearCompleted: t.field({
      type: 'Int',
      resolve: async (_root, _args, ctx) => {
        const result = await ctx.prisma.task.deleteMany({
          where: { completed: true },
        });
        return result.count;
      },
    }),
  }),
});
