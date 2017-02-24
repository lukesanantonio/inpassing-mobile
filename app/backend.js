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

export class Daystate {
  constructor(id, ident, greeting) {
    this.id = id;
    this.identifier = ident;
    this.greeting = greeting;
  }

  static fromApiObj(obj) {
    return new Daystate(obj.id, obj.identifier, obj.greeting);
  }
}

export class Pass {
  constructor(id, orgId, ownerId, requestedStateId, requestedSpotNum,
              requestTime, assignedStateId, assignedSpotNum, assignedTime) {
    this.id = id;
    this.orgId = orgId;

    this.ownerId = ownerId;

    this.requestedStateId = requestedStateId;
    this.assignedStateId = assignedStateId;

    this.requestedSpotNum = requestedSpotNum;
    this.requestTime = requestTime;

    this.assignedSpotNum = assignedSpotNum;
    this.assignedTime = assignedTime;

    // Not resolved yet
    this.org = null;
    this.requestedState = null;
    this.assignedState = null;

    // We are intentionally *not* resolving the owner because they currently
    // hold the reference to the passes so we don't want to make circular
    // dependencies.
  }

  static fromApiObj(obj) {
    return new Pass(obj.id, obj.org_id, obj.owner_id, obj.requested_state_id,
                    obj.requested_spot_num, obj.request_time,
                    obj.assigned_state_id, obj.assigned_spot_num,
                    obj.assigned_time);
  }

  resolve(cursor) {
    return Promise.all([
      this.resolveOrg(cursor),
      this.resolveAssignedState(cursor),
      this.resolveRequestedState(cursor),
    ]).then(() => this);
  }

  resolveOrg(cursor) {
    return cursor.getOrgById(this.orgId).then((org) => {
      this.org = org;
      return this;
    });
  }
  resolveAssignedState(cursor) {
    return cursor.getDaystateById(this.orgId, this.assignedStateId).then(
      (ds) => {
        this.assignedState = ds;
        return this;
      }
    );
  }
  resolveRequestedState(cursor) {
    return cursor.getDaystateById(this.orgId, this.requestedStateId).then(
      (ds) => {
        this.requestedState = ds;
        return this;
      }
    );
  }

  verified() {
    return !!this.assignedTime;
  }
  pending() {
    return !this.verified();
  }

  spotString() {
    let stateStr = '';
    let spotNum = '';
    if(this.verified()) {
      // Set spotnum
      spotNum = this.assignedSpotNum.toString();

      // If we've resolved the assigned daystate
      if(this.assignedState) {
        stateStr = this.assignedState.identifier;
      } else {
        stateStr = this.assignedStateId + ' (ID)';
      }
    } else {
      spotNum = this.requestedSpotNum.toString();

      if(this.requestedState) {
        stateStr = this.requestedState.identifier + ' (Pending)';
      } else {
        stateStr = this.requestedStateId + ' (ID, Pending)';
      }
    }

    return spotNum + '-' + stateStr;
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
    this.orgDaystateCache = {}
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
    var res = await fetch(makeUrl('orgs/' + orgId), {
      headers: {'Authorization': makeBearerAuth(this.token)}
    });
    var orgObj = await res.json();
    if(orgObj.id === undefined) {
      return null;
    }
    return Org.fromApiObj(orgObj);
  }

  getOrgById(orgId) {
    // Returns a promise to the resource
    return this.orgCache.getResource(orgId);
  }

  async _getDaystateById(orgId, daystateId) {
    const url = makeUrl('orgs/' + orgId + '/daystates/' + daystateId);
    var res = await fetch(url, {
      headers: {'Authorization': makeBearerAuth(this.token)}
    });
    var daystateObj = await res.json();
    if(daystateObj.id === undefined) {
      return null;
    }
    return Daystate.fromApiObj(daystateObj);
  }

  getDaystateById(orgId, daystateId) {
    // If we get an invalid ID return null.
    if(!daystateId) {
      return Promise.resolve(null);
    }

    if (!(orgId in this.orgDaystateCache)) {
      // Add a daystate cache for this particular org by binding its ID to the
      // callback we give the cache.
      // TODO: Beware race conditions!
      this.orgDaystateCache[orgId] = new ResourceCache((dsId) =>
        this._getDaystateById(orgId, dsId)
      );
    }
    return this.orgDaystateCache[orgId].getResource(daystateId);
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
