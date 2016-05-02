import dotenv from 'dotenv';
import request from './utilities';
import libdebug from 'debug';

dotenv.load();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const FACEBOOK_MESSAGES_URL = 'https://graph.facebook.com/v2.6/me/messages';
const debug = libdebug('fbmessenger:facebookmessenger');

/**
 * Facebook Messaging Service Class.
 * @class FacebookMessenger
 * @classdesc Sends messages.
 *
 * @requires module:dotenv
*/
function FacebookMessenger() {
  /*
  * Sends a text message.
  * @param {Number} senderId - Required. Sender Id.
  * @param {String} text - Required. Message to send.
  */
  function * sendSingleMessage(senderId, text) {
    const messageData = {
      text: text,
    };
    const body = {
      body: {
        recipient: {
          id: senderId,
        },
        message: messageData,
      },
      method: 'POST',
      qs: {
        access_token: PAGE_ACCESS_TOKEN,
      },
    };
    return yield request(FACEBOOK_MESSAGES_URL, body);
  }

  /*
  * Sends a text message.
  * @param {Number} senderId - Required. Sender Id.
  * @param {String} text - Required. Message to send.
  */
  this.sendTextMessage = function * sendTextMessage(senderId, text) {
    return yield sendSingleMessage(senderId, text);
  };

  this.processEvents = function * processEvents(events) {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const sender = event.sender.id;
      const message = (event.message && event.message.text) ? event.message.text : undefined;
      if (message) {
        console.log(`Sender: ${sender} Message: ${message}`);
        yield sendSingleMessage(sender, 'Hello from the cloud :)');
        debug(`Sender: ${sender}`);
        debug(`Message: ${message}`);
      }
    }
  };
}

module.exports = FacebookMessenger;
