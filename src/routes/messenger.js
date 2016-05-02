import koala from 'koala';
import krouter from 'koa-router';
import libdebug from 'debug';
import dotenv from 'dotenv';
import cors from 'koa-cors';
import Messenger from '../lib/facebook_messenger';

dotenv.load();
const messenger = new Messenger();
// Dont forget to set this environment variable with your webhook validation token
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;

const router = krouter();
const debug = libdebug('fbmessenger:messenger');

router.get('/', function * home(next) {
  const welcome = 'Welcome to Facebook Messenger Bot';
  this.body = welcome;
  this.status = 200;
  debug(welcome);
  yield next;
});

router.get('/hook', function * getHook(next) {
  const body = this.query;
  this.assert(body['hub.verify_token'] === VALIDATION_TOKEN, 401, 'Validation token is not valid');
  const hubChallenge = body['hub.challenge'];
  this.body = hubChallenge;
  this.status = 200;
  debug(hubChallenge);
  yield next;
});

router.post('/hook', function * setHook(next) {
  const body = yield * this.request.json();
  this.assert(body.entry[0].messaging, 400, 'No message events found.');
  const messagingEvents = body.entry[0].messaging;
  yield messenger.processEvents(messagingEvents);
  this.body = messagingEvents;
  this.status = 200;
  yield next;
});

export default function createFacebookMessengerBotApplication() {
  const app = koala()
    .use(cors())
    .use(function* assertBaseUrl(next) {
      this.assert(process.env.VALIDATION_TOKEN, 500, 'Validation token missing.');
      this.assert(process.env.PAGE_ACCESS_TOKEN, 500, 'Page access token missing.');
      yield* next;
    })
    .use(router.routes())
    .use(router.allowedMethods());

  app.name = 'fbmessenger:messenger';

  return app;
}
