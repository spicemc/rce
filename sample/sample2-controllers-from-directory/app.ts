import 'reflect-metadata';
import express from 'express';
import { useExpressServer } from '../../src/index.ts';

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  let app = express(); // create express server
  await useExpressServer(app, {
    controllers: [__dirname + '/controllers/*{.js,.ts}'], // register controllers routes in our express app
  });
  app.listen(3001); // run express app

  console.log(
    'Express server is running on port 3001. Open http://localhost:3001/blogs/ or http://localhost:3002/posts/',
  );
})();
