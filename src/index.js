/**
 * Import required 3rd party packages.
 */
import koala from 'koala';
import mount from 'koa-mount';
import dotenv from 'dotenv';
import cors from 'koa-cors';
/**
 * Import local sources.
 */
import createFacebookMessengerBotApplication from './routes/messenger';

export default function createApplication() {
  // Load environment variables if they are present.
  dotenv.load();
  return koala()
    .use(cors())
    .use(mount('/', createFacebookMessengerBotApplication()));
}
