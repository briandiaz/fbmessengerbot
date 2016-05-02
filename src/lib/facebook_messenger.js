import dotenv from 'dotenv';
import request from './utilities';
import libdebug from 'debug';

dotenv.load();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const FACEBOOK_MESSAGES_URL = 'https://graph.facebook.com/v2.6/me/messages';
const WEATHER_APP_ID = process.env.WEATHER_APP_ID;
const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather?appid=' + WEATHER_APP_ID;
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
  function * sendMessage(senderId, text, messageData = null) {
    const message = messageData || {
      text: text,
    };
    const body = {
      body: {
        recipient: {
          id: senderId,
        },
        message: message,
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
    return yield sendMessage(senderId, text);
  };

  function * sendForecast(senderId, message) {
    const city = message.split('weather')[1].replace('of', '').trim();
    const url = WEATHER_API_URL + '&q=' + city;
    const forecast = yield request(url, {
      method: 'GET',
    });
    if (forecast.name === undefined) {
      return yield sendMessage(senderId, 'City not found!');
    }
    console.log(forecast);
    // Convert Kelvin to Celsius
    const temperature = Math.ceil(forecast.main.temp - 273.15);
    const messageData = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': [{
            'title': temperature + ' °C',
            'subtitle': forecast.name,
            'image_url': 'http://openweathermap.org/img/w/' + forecast.weather[0].icon + '.png',
          },
          ],
        },
      },
    };
    return yield sendMessage(senderId, '', messageData);
  }

  this.processEvents = function * processEvents(events) {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const sender = event.sender.id;
      const message = (event.message && event.message.text) ? event.message.text : undefined;
      if (message) {
        console.log(`Sender: ${sender} Message: ${message}`);
        if (message.includes('weather')) {
          yield sendForecast(sender, message);
        }
        yield sendMessage(sender, 'Hello from the cloud :)');
        debug(`Sender: ${sender}`);
        debug(`Message: ${message}`);
      }
    }
  };
}

module.exports = FacebookMessenger;
