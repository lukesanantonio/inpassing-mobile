/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

const BASE_URL = 'http://159.203.130.135';
const API_PREFIX = '/api/v1/'

const AUTH_ENDPOINT = 'users/auth'
const ME_ENDPOINT = 'users/me'

function makeUrl(endpt) {
  return BASE_URL + API_PREFIX + endpt;
}

function makeBearerAuth(jwt) {
  return 'Bearer ' + jwt;
}

export class User {
  constructor(id, firstName, lastName, email) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

export class InPassingCursor {
  constructor(token) {
    this.token = token;
    this.cachedMe = null;
  }

  async me() {
    // If we already know who we are return that.
    if (this.cachedMe !== null) return this.cachedMe;

    // Figure out who we are authenticated as.
    var res = await fetch(makeUrl(ME_ENDPOINT), {
      headers: {'Authorization': makeBearerAuth(this.token)}
    });

    var usr_obj = await res.json();

    if(usr_obj.id === undefined) {
      // TODO: As soon as possible, check for the err field instead of checking
      // for a missing id.

      // Bad user
      return null;
    }
    this.cachedMe = new User(usr_obj.id, usr_obj.first_name, usr_obj.last_name,
                             usr_obj.email);
    return this.cachedMe;
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
