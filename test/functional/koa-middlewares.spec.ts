// test/functional/koa-middlewares.spec.ts

import 'reflect-metadata';
import { Server } from 'http';
import Koa from 'koa';
import HttpStatusCodes from 'http-status-codes';
import {
  createKoaServer,
  getMetadataArgsStorage,
} from '../../src/index';
import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Middleware } from '../../src/decorator/Middleware';
import { UseBefore } from '../../src/decorator/UseBefore';
import { UseAfter } from '../../src/decorator/UseAfter';
import { KoaMiddlewareInterface } from '../../src/driver/koa/KoaMiddlewareInterface';
import { NotAcceptableError } from '../../src/http-error/NotAcceptableError';
import { axios } from '../utilities/axios';
import DoneCallback = jest.DoneCallback;

describe('koa middlewares', () => {
  let koaServer: Server

  let useBefore: boolean
  let useAfter: boolean
  let useCustom: boolean
  let useGlobalBefore: boolean
  let useGlobalAfter: boolean
  let useCallOrder: string
  let useGlobalCallOrder: string

  beforeEach(() => {
    useBefore = false
    useAfter = false
    useCustom = false
    useGlobalBefore = false
    useGlobalAfter = false
    useCallOrder = ''
    useGlobalCallOrder = ''
  })

  beforeAll(async () => {
    // reset all metadata between test suites
    getMetadataArgsStorage().reset()

    // global before middleware
    @Middleware({ type: 'before' })
    class TestGlobalBeforeMiddleware implements KoaMiddlewareInterface {
      public async use(ctx: Koa.Context, next: () => Promise<any>): Promise<any> {
        useGlobalBefore = true
        useGlobalCallOrder = 'setFromGlobalBefore'
        return next()
      }
    }

    // global after middleware
    @Middleware({ type: 'after' })
    class TestGlobalAfterMiddleware implements KoaMiddlewareInterface {
      public async use(ctx: Koa.Context, next: () => Promise<any>): Promise<any> {
        const result = await next()
        useGlobalAfter = true
        useGlobalCallOrder = 'setFromGlobalAfter'
        return result
      }
    }

    // custom before middleware via decorator
    class TestCustomBefore implements KoaMiddlewareInterface {
      public async use(ctx: Koa.Context, next: () => Promise<any>): Promise<any> {
        useCustom = true
        return next()
      }
    }

    // custom middleware throwing
    class TestCustomThrows implements KoaMiddlewareInterface {
      public use(): any {
        throw new NotAcceptableError('TestCustomThrows')
      }
    }

    @Controller()
    class KoaMiddlewareController {
      @Get('/blogs')
      blogs(): string {
        useGlobalCallOrder = 'setFromController'
        return 'ok'
      }

      @Get('/questions')
      @UseBefore(TestCustomBefore)
      questions(): string {
        return 'ok'
      }

      @Get('/users')
      @UseBefore((ctx: Koa.Context, next: any) => {
        useBefore = true
        useCallOrder = 'setFromUseBefore'
        return next()
      })
      users(): string {
        useCallOrder = 'setFromController'
        return 'ok'
      }

      @Get('/photos')
      @UseAfter((ctx: Koa.Context, next: any) => {
        useAfter = true
        useCallOrder = 'setFromUseAfter'
        return next()
      })
      photos(): string {
        useCallOrder = 'setFromController'
        return 'ok'
      }

      @Get('/posts')
      @UseBefore((ctx: Koa.Context, next: any) => {
        useBefore = true
        useCallOrder = 'setFromUseBefore'
        return next()
      })
      @UseAfter((ctx: Koa.Context, next: any) => {
        useAfter = true
        useCallOrder = 'setFromUseAfter'
        return next()
      })
      posts(): string {
        useCallOrder = 'setFromController'
        return 'ok'
      }

      @Get('/throws')
      @UseBefore(TestCustomThrows)
      throws(): string {
        return 'nope'
      }
    }

    // build and start server
    const koaApp = await createKoaServer() as Koa;
    koaServer = koaApp.listen(3001);
  })

  afterAll((done: DoneCallback) => {
    koaServer.close(done)
  })

  it('should call global before and after middlewares in correct order', async () => {
    expect.assertions(4)
    const res = await axios.get('/blogs')
    expect(useGlobalBefore).toBe(true)
    expect(useGlobalAfter).toBe(true)
    expect(useGlobalCallOrder).toBe('setFromGlobalAfter')
    expect(res.status).toBe(HttpStatusCodes.OK)
  })

  it('should use custom middleware with @UseBefore', async () => {
    expect.assertions(2)
    const res = await axios.get('/questions')
    expect(useCustom).toBe(true)
    expect(res.status).toBe(HttpStatusCodes.OK)
  })

  it('should call @UseBefore before controller action', async () => {
    expect.assertions(3)
    const res = await axios.get('/users')
    expect(useBefore).toBe(true)
    expect(useCallOrder).toBe('setFromController')
    expect(res.status).toBe(HttpStatusCodes.OK)
  })

  it('should call @UseAfter after controller action', async () => {
    expect.assertions(3)
    const res = await axios.get('/photos')
    expect(useAfter).toBe(true)
    expect(useCallOrder).toBe('setFromUseAfter')
    expect(res.status).toBe(HttpStatusCodes.OK)
  })

  it('should call both @UseBefore and @UseAfter in correct order', async () => {
    expect.assertions(4)
    const res = await axios.get('/posts')
    expect(useBefore).toBe(true)
    expect(useAfter).toBe(true)
    expect(useCallOrder).toBe('setFromUseAfter')
    expect(res.status).toBe(HttpStatusCodes.OK)
  })

  it('should handle errors in custom middleware', async () => {
    expect.assertions(1)
    try {
      await axios.get('/throws')
    } catch (err: any) {
      expect(err.response.status).toBe(HttpStatusCodes.NOT_ACCEPTABLE)
    }
  })
})
