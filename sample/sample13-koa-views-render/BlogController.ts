import { Controller } from '../../src/decorator/Controller';
import { Get } from '../../src/decorator/Get';
import { Render } from '../../src/decorator/Render';

@Controller()
export class BlogController {
  @Get('/')
  @Render('blog')
  blog() {
    return {
      title: 'My Blog',
      posts: [
        {
          title: 'Welcome to my blog',
          content: 'This is my new blog built with Koa, routing-controllers-extended and @koa/ejs',
        },
        {
          title: 'Hello World',
          content: 'Hello world from Koa and routing-controllers-extended',
        },
      ],
    };
  }
}
