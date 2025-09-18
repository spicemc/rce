import 'reflect-metadata';
import { createExpressServer } from '../../src/index';
import { BlogController } from './BlogController';

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  const app = await createExpressServer({
    controllers: [BlogController],
  });
  app.listen(3001);
  console.log(
    'Express server is running on port 3001. Open http://localhost:3001/blogs?filter[keyword]=ABCD&filter[limit]=30&filter[offset]=0',
  );
})();
