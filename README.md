# Task List API

A GraphQL API for managing tasks. Built with TypeScript, GraphQL Yoga, Pothos, Prisma, and Zod.

## Prerequisites

- Node.js 20+
- npm

## Getting Started

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

Defaults in `.env.example` work out of the box for local development. `npm run setup` applies the Prisma migration and generates the Prisma client. Optionally run `npm run seed` to insert a few sample tasks.

The server listens on the port set by `PORT` in `.env` (default `4000`). GraphiQL is available at `/graphql` for running queries.

## Usage

### Queries

- `tasks: [Task!]!` returns all tasks
- `task(id: ID!): Task` returns a single task by id

### Mutations

- `addTask(input: AddTaskInput!): Task!`
- `toggleTask(id: ID!): Task!`
- `deleteTask(id: ID!): Task!`
- `updateTask(id: ID!, input: UpdateTaskInput!): Task!`
- `clearCompleted: Int!`

### Examples

List all tasks:

```graphql
query {
  tasks {
    id
    title
    completed
    createdAt
    updatedAt
  }
}
```

Fetch a single task:

```graphql
query {
  task(id: "<task-id>") {
    id
    title
    completed
  }
}
```

Create a task:

```graphql
mutation {
  addTask(input: { title: "Buy milk" }) {
    id
    title
    completed
  }
}
```

Toggle a task's completed state:

```graphql
mutation {
  toggleTask(id: "<task-id>") {
    id
    completed
  }
}
```

Update a task:

```graphql
mutation {
  updateTask(id: "<task-id>", input: { title: "New title" }) {
    id
    title
  }
}
```

Delete a task:

```graphql
mutation {
  deleteTask(id: "<task-id>") {
    id
  }
}
```

Clear all completed tasks:

```graphql
mutation {
  clearCompleted
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
- `npm run setup` applies Prisma migrations and regenerates the Prisma client
- `npm run prisma:migrate` applies Prisma migrations
- `npm run prisma:generate` regenerates the Prisma client
- `npm run seed` seeds the database with sample tasks

## Project Structure

```
src/
├── schema/
│   ├── builder.ts   Pothos SchemaBuilder and plugin setup
│   ├── task.ts      Task type and resolvers
│   └── index.ts     Assembled GraphQL schema
├── context.ts       GraphQL context factory
├── db.ts            Prisma client singleton
└── index.ts         Yoga server and entry point
prisma/
├── schema.prisma    Database schema
└── seed.ts          Seed script for local dev
prisma.config.ts     Prisma config (datasource URL)
```

## License

MIT
