import 'reflect-metadata';
import express from 'express';
import { useExpressServer } from '../../src/index.ts';

const baseDir = __dirname;

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  let app = express(); // create express server
  await useExpressServer(app, {
    controllers: [baseDir + '/modules/**/controllers/*{.js,.ts}'], // register controllers routes in our express app
    middlewares: [baseDir + '/modules/**/middlewares/*{.js,.ts}'], // register middlewares in our express app
  });
  app.listen(3001); // run express app

  console.log(
    'Express server is running on port 3001. Open http://localhost:3001/blogs/ or http://localhost:3001/posts/',
  );
})();
