import 'reflect-metadata';
import { createExpressServer } from '../../src/index';
import { BlogController } from './BlogController';
import { CompressionMiddleware } from './CompressionMiddleware';
import { LoggerMiddleware } from './LoggerMiddleware';
import { StartTimerMiddleware } from './StartTimerMiddleware';
import { EndTimerMiddleware } from './EndTimerMiddleware';
import { AllErrorsHandler } from './AllErrorsHandler';

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  const app = await createExpressServer({
    controllers: [BlogController],
    middlewares: [LoggerMiddleware, StartTimerMiddleware, EndTimerMiddleware, CompressionMiddleware],
  });
  app.listen(3001);
  console.log('Express server is running on port 3001. Open http://localhost:3001/blogs/');
})();
