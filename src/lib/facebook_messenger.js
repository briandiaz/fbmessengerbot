import dotenv from 'dotenv';
import request from './utilities';

dotenv.load();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const FACEBOOK_MESSAGES_URL = 'https://graph.facebook.com/v2.6/me/messages';

/**
 * Facebook Messaging Service Class.
 * @class FacebookMessenger
 * @classdesc Sends messages.
 *
 * @param {Number} senderId - Id of sender, sets {@link FacebookMessenger#sender}.
 * @requires module:dotenv
*/
function FacebookMessenger(senderId) {
  /**
    Querying object instance.

    @name FacebookMessenger#sender
    @type Object
  */
  const sender = senderId;
  /*
  * Sends a text message.
  * @param {String} text - Required. Message to send.
  */
  this.sendTextMessage = function * sendTextMessage(text) {
    const messageData = {
      text: text,
    };
    const body = {
      body: {
        recipient: {
          id: sender,
        },
        message: messageData,
      },
      method: 'POST',
      qs: {
        access_token: PAGE_ACCESS_TOKEN,
      },
    };
    return yield request(FACEBOOK_MESSAGES_URL, body);
  };
}

module.exports = FacebookMessenger;
