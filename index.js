require('dotenv').config();

import { json } from 'body-parser';
import { connection } from 'mongoose';
import express from 'express';
import graphQl from 'express-graphql';
const app = express();

import { error, fatal, info } from './src/util/logger';
import connectDb from './src/util/connectDb';

// GraphQL Implementation
import gqlSchema from './src/graphql/schema';
import gqlResolver from './src/graphql/resolvers';

// General Middleware
app.use(json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ALLOWED_ORIGINS);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  next();
});

// GraphQL Endpoint
app.use(
  '/graphql',
  graphQl({
    schema: gqlSchema,
    rootValue: gqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      } else {
        const data = err.originalError.data;
        const code = err.originalError.code || 500;
        const message = err.message;
        return { message, code, data };
      }
    }
  })
);

// Error Handling
app.use((err, req, res, next) => {
  error(err);
  const status = err.statusCode || 500;
  const { message, data } = err;
  res.status(status).json({ message, data });
});

process.on('uncaughtException', err => {
  fatal(err);
});

process.on('unhandledRejection', reason => {
  throw reason;
});

// Server Setup
const PORT = process.env.PORT || 8080;

connection.once('open', () => {
  app.listen(PORT, () => {
    info(`Server listening on port ${PORT}`);
  });
});

connectDb(10000).catch(err => {
  fatal(err);
  process.exitCode = 1;
});
