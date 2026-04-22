import 'dotenv/config';
import { createLogger } from 'graphql-yoga';
import { prisma } from '../src/db.js';

const logger = createLogger();

const seedTasks = [
  { title: 'Buy milk' },
  { title: 'Read a book', completed: true },
  { title: 'Go for a run' },
];

// Wipes existing rows so repeat runs stay idempotent
async function main() {
  await prisma.task.deleteMany();
  for (const data of seedTasks) {
    await prisma.task.create({ data });
  }
  logger.info(`Seeded ${seedTasks.length} tasks`);
}

main()
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
