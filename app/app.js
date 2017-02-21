/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';
import {Text} from 'react-native';
import {StackNavigator, NavigationActions} from 'react-navigation';

import {Auth} from './auth';

export class AuthScreen extends Component {
  static navigationOptions = {
    header: {
      visible: false
    }
  }

  _onAuth(navigation, cursor) {
    var resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'PassHome', cursor})
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return <Auth onAuth={this._onAuth.bind(this)} />;
  }
}

export class PassHome extends Component {
  static navigationOptions = {
    title: 'PassHome'
  }

  render() {
    return <Text>{this.props.navigation.state.cursor.token}</Text>;
  }
}
export class OrgHome extends Component {
  static navigationOptions = {
    title: 'OrgHome'
  }

  render() {
    return <Text>OrgHome</Text>;
  }
}

const App = StackNavigator({
  Auth: {
    screen: AuthScreen,
  },
  PassHome: {
    screen: PassHome
  },
  OrgHome: {
    screen: OrgHome
  }
});

export default App;
