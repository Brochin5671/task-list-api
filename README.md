# Task List API

A GraphQL API for managing tasks. Built with TypeScript, GraphQL Yoga, Pothos, Prisma, and Zod.

## Prerequisites

- Node.js 20+
- npm

## Getting Started

```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run dev
```

The server starts on `http://localhost:4000/graphql`, where GraphiQL is available for running queries.

## Usage

### Queries

- `tasks: [Task!]!` returns all tasks
- `task(id: ID!): Task` returns a single task by id

### Mutations

- `addTask(input: AddTaskInput!): Task!`
- `toggleTask(id: ID!): Task!`
- `deleteTask(id: ID!): Task!`

### Example

```graphql
mutation {
  addTask(input: { title: "Buy milk" }) {
    id
    title
    completed
  }
}
```

## Scripts

- `npm run dev` starts the server with live reload
- `npm run build` compiles TypeScript to `dist/`
- `npm start` runs the compiled server
- `npm run typecheck` type-checks without emitting
- `npm run lint` runs ESLint
- `npm run lint:fix` runs ESLint with autofix
- `npm run format` formats files with Prettier
- `npm run prisma:migrate` applies Prisma migrations
- `npm run prisma:generate` regenerates the Prisma client

## Project Structure

```
src/
├── schema/
│   ├── builder.ts   Pothos SchemaBuilder and plugin setup
│   ├── task.ts      Task type and resolvers
│   └── index.ts     Assembled GraphQL schema
├── context.ts       GraphQL context factory
├── db.ts            Prisma client singleton
├── server.ts        Yoga server
└── index.ts         Entry point
prisma/
└── schema.prisma    Database schema
```

## License

MIT
