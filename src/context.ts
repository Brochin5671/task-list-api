import { prisma } from './db.js';

export type Context = {
  prisma: typeof prisma;
};

export function createContext(): Context {
  return { prisma };
}
