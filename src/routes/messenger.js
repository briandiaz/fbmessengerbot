import koala from 'koala';
import krouter from 'koa-router';
import libdebug from 'debug';
import dotenv from 'dotenv';
import cors from 'koa-cors';

dotenv.load();

const router = krouter();
const debug = libdebug('fbmessenger:messenger');

router.get('/', function * listInspections(next) {
  this.body = 'Welcome to Facebook Messenger Bot';
  this.status = 200;
  yield next;
});

export default function createFacebookMessengerBotApplication() {
  const app = koala()
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods());

  app.name = 'fbmessenger:messenger';

  return app;
}
