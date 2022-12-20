import express from 'express';
import { Server as HttpServer } from 'http';
import HttpStatusCodes from 'http-status-codes';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Middleware } from '../../src/decorator/Middleware';
import { ExpressMiddlewareInterface } from '../../src/driver/express/ExpressMiddlewareInterface';
import { createExpressServer, getMetadataArgsStorage } from '../../src/index';
import { axios, getAxiosInstance } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe(``, () => {
  let expressServer1: HttpServer;
  let expressServer2: HttpServer;

  describe('middleware per route prefix', () => {
    let middlewaresOrder: number[];

    beforeEach(() => {
      middlewaresOrder = [];
    });

    beforeAll((done: DoneCallback) => {
      getMetadataArgsStorage().reset();

      @Middleware({ type: 'after' })
      class ThirdAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          middlewaresOrder.push(3);
          next();
        }
      }

      @Middleware({ type: 'after' })
      class FirstAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          middlewaresOrder.push(1);
          next();
        }
      }

      @Middleware({ type: 'after' })
      class SecondAfterMiddleware implements ExpressMiddlewareInterface {
        use(request: express.Request, response: express.Response, next: express.NextFunction): any {
          middlewaresOrder.push(2);
          next();
        }
      }

      @Controller()
      class ExpressMiddlewareController {
        @Get('/test')
        test(): string {
          return 'OK';
        }
      }

      expressServer1 = createExpressServer({
        routePrefix: '/app',
        middlewares: [FirstAfterMiddleware, SecondAfterMiddleware, ThirdAfterMiddleware],
      }).listen(3001);

      expressServer2 = createExpressServer({
        routePrefix: '/admin',
        middlewares: [SecondAfterMiddleware],
      }).listen(3011);
      done();
    });

    afterAll((done: DoneCallback) => {
      expressServer1.close();
      expressServer2.close();
      done();
    });

    it('should use middlewares for app and admin route prefixes separately', async () => {
      expect.assertions(8);
      const response = await axios.get('/app/test');
      expect(response.status).toEqual(HttpStatusCodes.OK);
      expect(middlewaresOrder[0]).toEqual(1);
      expect(middlewaresOrder[1]).toEqual(2);
      expect(middlewaresOrder[2]).toEqual(3);
      expect(middlewaresOrder.length).toEqual(3);

      middlewaresOrder = []; // reset global values

      const axios2 = getAxiosInstance({ baseURL: 'http://localhost:3011/' });
      const response2 = await axios2.get('/admin/test');
      expect(response2.status).toEqual(HttpStatusCodes.OK);
      expect(middlewaresOrder[0]).toEqual(2);
      expect(middlewaresOrder.length).toEqual(1);
    });
  });
});
