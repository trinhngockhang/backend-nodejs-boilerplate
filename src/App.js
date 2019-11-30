import express from 'express';
import config from './config';
import routers from './components/router';
// Middleware
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { authMiddleware, errorHandler, ok, corsMiddleware } from './middleware';
// Log
import { logger } from './util/logUtil';

const expressApp = express();

// middleware
expressApp.use(morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message);
    },
  },
}));
expressApp.use(corsMiddleware);
expressApp.use(bodyParser.json({ limit: '50mb' }));
expressApp.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb',
}));
expressApp.use(authMiddleware);
expressApp.use(ok);

// routers
for (const router of routers) {
  expressApp.use(router.path, router.router);
}

// error handle
expressApp.use(errorHandler);

// run Express Server
expressApp.listen(config.port, () => {
  logger.info(`App is running at http://localhost:${config.port}`);
});
