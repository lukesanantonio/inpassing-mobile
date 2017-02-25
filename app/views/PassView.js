/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import {
  Container,
  Content,
  Button,
} from 'native-base';

import ClickCard from './ClickCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  buttonText: {
    color: 'white',
  },
  nextUseDate: {
    fontWeight: 'bold'
  },
});

export default class PassView extends Component {
  static navigationOptions = {
    title: (navigation) => {
      if(!navigation.state.params.pass) {
        return 'Pass';
      }
      return 'Spot ' + navigation.state.params.pass.spotString();
    }
  }

  getPass() {
    return this.props.pass || this.props.navigation.state.params.pass;
  }

  _onOrgPress() {
    this.props.navigation.navigate('OrgView', {org: this.getPass().org});
  }

  _onCalendarView() {
    this.props.navigation.navigate('Calendar');
  }

  _onLend() {
  }

  render() {
    var pass = this.getPass();
    return (
      <Container>
        <Content>
          <ClickCard arrowText="Details" onPress={() => this._onOrgPress()}>
            <Text style={styles.cardText}>
              {pass.org.name}
            </Text>
          </ClickCard>
          <ClickCard arrowText="Calendar" onPress={() => this._onCalendarView()}>
            <Text style={styles.cardText}>
              Usable <Text style={styles.nextUseDate}>today</Text>
            </Text>
          </ClickCard>
          <Button full onPress={() => this._onLend()}>
            <Text style={styles.buttonText}>
              Lend pass
            </Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
