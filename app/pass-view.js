/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  spot: {
    fontSize: 30,
    textAlign: 'center',
  },
  orgName: {

  },
});

export class PassView extends Component {
  static navigationOptions = {
    title: (navigation) => {
      if(!navigation.state.params.pass) {
        return 'Pass';
      }
      return 'Spot ' + navigation.state.params.pass.spotString();
    }
  }
  render() {
    var pass = this.props.pass || this.props.navigation.state.params.pass;
    return (
      <View style={styles.container}>
        <TouchableHighlight>
          <Text style={styles.orgName}>
            {pass.org.name}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
