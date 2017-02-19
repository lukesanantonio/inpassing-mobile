/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import {Auth} from './app/auth';

export default class InPassingMobile extends Component {
  render() {
    return <Auth />
  }
}

AppRegistry.registerComponent('InPassingMobile', () => InPassingMobile);
