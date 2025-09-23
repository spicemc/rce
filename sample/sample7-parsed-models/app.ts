import 'reflect-metadata';
import { createExpressServer } from '../../src/index';
import { UserController } from './UserController';

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  const app = await createExpressServer({
    controllers: [UserController],
  });
  app.listen(3001);
  console.log('Express server is running on port 3001. Open http://localhost:3001/users/');
})();
