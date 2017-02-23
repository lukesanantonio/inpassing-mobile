/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';
import {View} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';

import {PassHome, OrgHome, PassView, OrgView} from './home';
import {Auth} from './auth';

const HomeNavigator = TabNavigator({
  PassHome: {
    screen: PassHome
  },
  OrgHome: {
    screen: OrgHome
  }
});

HomeNavigator.navigationOptions = {
  header: {
    visible: false,
  }
}

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
    // The View wrapper is a quick-fix for a layout bug in react-navigation.
    return (
      <View style={{flex: 1}}>
        <Auth onAuth={this._onAuth.bind(this)} />
      </View>
    );
  }
}

const App = StackNavigator({
  Auth: {
    screen: AuthScreen,
  },
  Home: {
    screen: HomeNavigator
  },
  PassView: {
    screen: PassView
  },
  OrgView: {
    screen: OrgView
  }
});

export default App;
