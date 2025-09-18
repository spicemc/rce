import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import { useExpressServer } from '../../src/index.ts';
import { UserController } from './UserController';

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  let app = express(); // create express server
  app.use(session({
    secret: 'sessionsecret',
    saveUninitialized: true,
  })); // use session middleware
  await useExpressServer(app, {
    controllers: [UserController], // register controllers routes in our express app
  });
  app.listen(3001); // run express app

  console.log(
    'Express server is running on port 3001. Open http://localhost:3001/users/',
  );
})();
