import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { createKoaServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let koaServer: HttpServer;

  describe('koa trailing slashes', () => {
    beforeEach(async () => {
      getMetadataArgsStorage().reset();

      @Controller('/posts')
      class PostController {
        @Get('/')
        getAll(): string {
          return '<html><body>All posts</body></html>';
        }
      }

      const koaApp = await createKoaServer();
      koaServer = koaApp.listen(3001);
    });

    afterEach((done: DoneCallback) => {
      koaServer.close(done);
    });

    it('get should respond to request without a traling slash', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>All posts</body></html>');
    });

    it('get should respond to request with a traling slash', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts/');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>All posts</body></html>');
    });
  });
});
