import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer: HttpServer;

  describe('controller > base routes functionality', () => {
    // beforeEach((done: DoneCallback) => {
    beforeEach(async () => {
      getMetadataArgsStorage().reset();

      @Controller('/posts')
      class PostController {
        @Get('/')
        getAll(): string {
          return '<html><body>All posts</body></html>';
        }

        @Get('/:id')
        getUserById(): string {
          return '<html><body>One post</body></html>';
        }

        @Get('/categories/:id')
        getCategoryById(): string {
          return '<html><body>One post category</body></html>';
        }

        @Get('/:postId/users/:userId')
        getPostById(): string {
          return '<html><body>One user</body></html>';
        }
      }

      const expressApp = await createExpressServer({
        controllers: [PostController],
      });
      expressServer = expressApp.listen(3001);

      // async function bootstrap() {
      //   const expressApp = await createExpressServer({
      //     controllers: [PostController],
      //   })
      //   expressServer = expressApp.listen(3001);
      // }

      // await bootstrap();

      // const expressApp = await createExpressServer({
      //   controllers: [PostController],
      // }).listen(3001, done);
    });

    afterEach((done: DoneCallback) => {
      expressServer.close(done);
    });

    it('1. get should respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>All posts</body></html>');
    });

    it('get should respond with proper status code, headers and body content', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts/1');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>One post</body></html>');
    });

    it('get should respond with proper status code, headers and body content - 2nd pass', async () => {
      expect.assertions(3);
      const response = await axios.get('/posts/1/users/2');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(response.headers['content-type']).toEqual('text/html; charset=utf-8');
      expect(response.data).toEqual('<html><body>One user</body></html>');
    });

    it('wrong route should respond with 404 error', async () => {
      expect.assertions(1);
      try {
        await axios.get('/1/users/1');
      } catch (error: any) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });

    it('wrong route should respond with 404 error', async () => {
      expect.assertions(1);
      try {
        await axios.get('/categories/1');
      } catch (error: any) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });

    it('wrong route should respond with 404 error', async () => {
      expect.assertions(1);
      try {
        await axios.get('/users/1');
      } catch (error: any) {
        expect(error.response.status).toEqual(HttpStatusCodes.NOT_FOUND);
      }
    });
  });
});
