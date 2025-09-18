import 'reflect-metadata';
import { createExpressServer } from '../../src/index';
import { BlogController } from './BlogController';

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  const app = await createExpressServer({
    controllers: [BlogController],
    errorOverridingMap: {
      ForbiddenError: {
        message: 'Access is denied',
      },
      ValidationError: {
        httpCode: '400',
        message: 'Oops, Validation failed.',
      },
    }
  });
  app.listen(3001);
  console.log('Express server is running on port 3001. Open http://localhost:3001/blogs/');
})();
