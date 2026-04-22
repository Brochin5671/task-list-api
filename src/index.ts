import 'dotenv/config';
import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema/index.js';
import { createContext } from './context.js';

const yoga = createYoga({
  schema,
  context: createContext,
});

const port = Number(process.env.PORT) || 4000;

createServer(yoga).listen(port, () => {
  yoga.logger.info(`GraphQL server ready at http://localhost:${port}/graphql`);
});
