import pino from 'pino';

let logger;
if (process.env.NODE_ENV === 'development') {
  logger = pino({
    prettyPrint: true
  });
} else {
  logger = pino();
}

export default logger;
