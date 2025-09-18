import 'reflect-metadata';
import { createExpressServer } from '../../src/index';
import { Action } from '../../src/Action';
import { QuestionController } from './QuestionController';
import { User } from './User';

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  const app = await createExpressServer({
    controllers: [QuestionController],
    currentUserChecker: async (action: Action, value?: any) => {
      // perform queries based on token from request headers
      // const token = action.request.headers["authorization"];
      // return database.findUserByToken(token);
      return new User(1, 'Johny', 'Cage');
    }
  });
  app.listen(3001);
  console.log('Express server is running on port 3001. Open http://localhost:3001/questions/');
})();
