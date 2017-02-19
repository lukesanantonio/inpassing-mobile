/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

const BASE_URL = 'http://159.203.130.135';
const API_PREFIX = '/api/v1/'

const AUTH_ENDPOINT = 'users/auth'
const ME_ENDPOINT = 'me'

function makeUrl(endpt) {
  return BASE_URL + API_PREFIX + endpt;
}

class InPassingCursor {
  constructor(token) {
    this.token = token;
  }

  cacheMe() {
    // Figure out who we are authenticated as.
    const url = makeUrl(ME_ENDPOINT);
  }
}

export default class InPassingBackend {
  static async auth(email, password) {
    // Leave error handling of the request itself up to the caller.
    var res = await fetch(makeUrl(AUTH_ENDPOINT), {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    // We expect a json response.
    var json = await res.json();
    if (!json.hasOwnProperty('access_token')) {
      // TODO: Take into account json.err. Currently it is not always present,
      // especially important is that it is isn't present when we get the
      // invalid username or password error.
      return Promise.reject(json.msg);
    }

    // Return an authenticated user to consume the api.
    return new InPassingCursor(json.access_token);
  }
}
