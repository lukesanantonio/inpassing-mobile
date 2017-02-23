/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';
import {StackNavigator, NavigationActions} from 'react-navigation';

import {OrgHome} from './home';
import {Auth} from './auth';

export class AuthScreen extends Component {
  static navigationOptions = {
    header: {
      visible: false
    }
  }

  _onAuth(cursor) {
    this.props.navigation.navigate('Home', {cursor});
  }

  render() {
    return <Auth onAuth={this._onAuth.bind(this)} />;
  }
}

const App = StackNavigator({
  Auth: {
    screen: AuthScreen,
  },
  OrgHome: {
    screen: OrgHome
  }
});

export default App;
