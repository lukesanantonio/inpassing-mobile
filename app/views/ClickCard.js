/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';

import {StyleSheet, Text} from 'react-native';

import {
  Card, CardItem, Body, Right, Icon
} from 'native-base';

const styles = StyleSheet.create({
  cardBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRight: {
    flex: 0,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
});

const style_cardBody = StyleSheet.flatten(styles.cardBody);
const style_cardRight = StyleSheet.flatten(styles.cardRight);

export default class ClickCard extends Component {
  render() {
    var arrowText = null;
    if(this.props.arrowText) {
      // That space after the {...} is intentional. It adds some space between
      // the text and the icon.
      arrowText = <Text>{this.props.arrowText} </Text>;
    }

    return (
      <Card style={this.props.style}>
        <CardItem header button onPress={this.props.onPress}>
          <Body style={style_cardBody}>
            {this.props.children}
          </Body>
          <Right style={style_cardRight}>
            <Icon name="arrow-forward"/>
            {arrowText}
          </Right>
        </CardItem>
      </Card>
    );
  }
}
