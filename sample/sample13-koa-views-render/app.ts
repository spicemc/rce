import 'reflect-metadata';
import koa from 'koa';
import koaEjs from '@koa/ejs';
import path from 'node:path';
import { createKoaServer, useKoaServer } from '../../src/index';
import { BlogController } from './BlogController';

const resourcePath: string = path.resolve('./');

// Top level await workaround. Not needed if your project supports top level await.
(async () => {
  // example with createKoaServer (creates a new koa app internally)
  // const app = (await createKoaServer({
  //     controllers: [BlogController],
  // })) as Koa;

  // example with an existing koa app
  let app = new koa();
  await useKoaServer(app, {
    controllers: [BlogController],
  });
  koaEjs(app, {
    root: resourcePath,
    layout: false,
    viewExt: 'html', // Auto-appended to template name
    cache: false,
    debug: false,
  });

  app.listen(3001);
  console.log('Koa server is running on port 3001. Open http://localhost:3001/');
})();
