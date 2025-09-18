import 'reflect-metadata';
import { createExpressServer } from '../../src/index';
import { Action } from '../../src/Action';
import { QuestionController } from './QuestionController';

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  const app = await createExpressServer({
    controllers: [QuestionController],
    authorizationChecker: async (action: Action, roles?: string[]) => {
      // perform queries based on token from request headers
      // const token = action.request.headers["authorization"];
      // return database.findUserByToken(token).roles.in(roles);
      return false;
    }
  });
  app.listen(3001);
  console.log('Express server is running on port 3001. Open http://localhost:3001/questions/');
})();
