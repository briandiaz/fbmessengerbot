import request from 'co-request';
import libdebug from 'debug';

const debug = libdebug('utilities');

export default function * createRequest(url, options) {
  const args = {
    uri: url,
    json: true,
    method: options.method || 'GET',
    body: options.body || {},
    qs: options.qs || '',
  };
  try {
    const response = yield request(args);
    return response.body;
  } catch (error) {
    debug('Error ocurred:', error);
  }
}
