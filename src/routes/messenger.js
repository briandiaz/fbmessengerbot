import koala from 'koala';
import krouter from 'koa-router';
import libdebug from 'debug';
import dotenv from 'dotenv';
import cors from 'koa-cors';

dotenv.load();
// Dont forget to set this environment variable with your webhook validation token
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;

const router = krouter();
const debug = libdebug('fbmessenger:messenger');

router.get('/', function * listInspections(next) {
  const welcome = 'Welcome to Facebook Messenger Bot';
  this.body = welcome;
  this.status = 200;
  debug(welcome);
  yield next;
});

router.get('/hook', function * listInspections(next) {
  const body = this.query;
  this.assert(body['hub.verify_token'] === VALIDATION_TOKEN, 401, 'Validation token is not valid');
  this.body = body['hub.challenge'];
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
