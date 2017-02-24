/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';

import {StyleSheet} from 'react-native';

import {
  Card, CardItem, Body, Right, Icon
} from 'native-base';

const styles = StyleSheet.create({
  cardBody: {
    flex: 15,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  cardIcon: {
    flex: 1,
  }
});

const style_cardBody = StyleSheet.flatten(styles.cardBody);
const style_cardIcon = StyleSheet.flatten(styles.cardIcon);

export default class ClickCard extends Component {
  render() {
    return (
      <Card style={this.props.style}>
        <CardItem header button onPress={this.props.onPress}>
          <Body style={style_cardBody}>
            {this.props.children}
          </Body>
          <Right style={style_cardIcon}>
            <Icon name="arrow-forward"/>
          </Right>
        </CardItem>
      </Card>
    );
  }
}
