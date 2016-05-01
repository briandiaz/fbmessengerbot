import koala from 'koala';
import krouter from 'koa-router';
import libdebug from 'debug';
import dotenv from 'dotenv';
import cors from 'koa-cors';

dotenv.load();

const router = krouter();
const debug = libdebug('fbmessenger:messenger');

router.get('/', function * listInspections(next) {
  const welcome = 'Welcome to Facebook Messenger Bot';
  this.body = welcome;
  this.status = 200;
  debug(welcome);
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
