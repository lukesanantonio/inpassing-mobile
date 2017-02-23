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

export class Org {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static fromApiObj(obj) {
    return new Org(obj.id, obj.name);
  }
}

export class Pass {
  constructor(id, orgId, ownerId, stateId, spotNum) {
    this.id = id;
    this.orgId = orgId;
    this.ownerId = ownerId;
    this.stateId = stateId;
    this.spotNum = spotNum;
  }

  static fromApiObj(obj) {
    return new Pass(obj.id, obj.org_id, obj.owner_id, obj.state_id,
                    obj.spot_num);
  }
}

export class User {
  constructor(id, firstName, lastName, email, passes) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passes = passes;
  }
  static fromApiObj(obj) {
    return new User(obj.id, obj.first_name, obj.last_name, obj.email,
                    obj.passes.map(Pass.fromApiObj))
  }
}

class ResourceCache {
  constructor(func) {
    this.promiseCache = {}
    this.resourceCache = {}
    this.func = func;
  }

  invalidate(id) {
    this.promiseCache[id] = undefined;
    this.resourceCache[id] = undefined;
  }

  getResource(id) {
    if (id in this.resourceCache) {
      // The resource has already been retrieved.
      return Promise.resolve(this.resourceCache[id]);
    } else if (id in this.promiseCache) {
      // The resource is currently being retrieved.
      return this.promiseCache[id]
    } else {
      // Retrieve the resource now
      var promise = this.func(id);

      // Take note of the promise
      this.promiseCache[id] = promise;

      promise.then((val) => {
        // We found the resource, add it to our resource cache.
        this.resourceCache[id] = val;
      });

      return promise;
    }
  }
}

export class InPassingCursor {
  constructor(token) {
    this.token = token;
    this.userCache = new ResourceCache(this._getUser.bind(this));
    this.orgCache = new ResourceCache(this._getOrgById.bind(this));
  }

  async _getUser(id) {
    if (id !== 0) {
      // We need to query a specific user, but we don't support that yet.
      throw ('Querying arbitrary users is not implemented yet. ' +
             'Use ID 0 for me object');
    }

    // Query me
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
    return User.fromApiObj(usr_obj);
  }

  async me() {
    // User 0 is by convention the me user.
    return this.userCache.getResource(0);
  }

  async _getOrgById(orgId) {
    var res = await fetch(makeUrl('orgs/' + orgId));
    var org_obj = await res.json();
    if(org_obj.id === undefined) {
      return null;
    }
    return Org.fromApiObj(org_obj);
  }

  getOrgById(orgId) {
    // Returns a promise to the resource
    return this.orgCache.getResource(orgId);
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
