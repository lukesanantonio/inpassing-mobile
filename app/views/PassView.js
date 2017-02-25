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
  Spinner
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

  constructor(props) {
    super(props);

    this.state = {
      lendButtonSpinner: null,
      lendResult: null,
      lendError: null,
    };
  }

  getPass() {
    return this.props.pass || this.props.navigation.state.params.pass;
  }

  getCursor() {
    return this.props.cursor || this.props.navigation.state.params.cursor;
  }

  _onOrgPress() {
    this.props.navigation.navigate('OrgView', {
      org: this.getPass().org,
      cursor: this.getCursor()
    });
  }

  _onCalendarView() {
    this.props.navigation.navigate('Calendar');
  }

  _onLend() {
    // Add a progress bar to the button
    var lendSpinner = <Spinner />;
    this.setState({lendSpinner});

    // TODO: Support different days and a day range.
    var cursor = this.getCursor();
    // Make the request to lend the pass today.
    cursor.lendPassOnDate(this.getPass().id, new Date()).then(() => {
      // Don't bother looking at the res object yet. It includes which days the
      // pass was enqueued and which days it was already on the queue. Later on
      // we can provide good information like, you're already lending the pass
      // on this day, etc.
      this.setState({lendResult: 'Success', lendSpinner: null});
    }).catch((err) => {
      this.setState({lendError: err, lendSpinner: null});
    });
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
          <Text>
            Result {this.state.lendResult}
          </Text>
          <Text>
            Error {this.state.lendError}
          </Text>
          {this.state.lendSpinner}
        </Content>
      </Container>
    );
  }
}
