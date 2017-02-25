/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';
import {Text} from 'react-native';
import {Container, Content} from 'native-base';

import ClickCard from './ClickCard';


export default class OrgView extends Component {
  static navigationOptions = {
    title: (navigation) => {
      if(!navigation.state.params.org) {
        return 'Org';
      }
      return navigation.state.params.org.name;
    }
  };

  getOrg() {
    return this.props.org || this.props.navigation.state.params.org;
  }

  getCursor() {
    return this.props.cursor || this.props.navigation.state.params.cursor;
  }

  _onCalendarView() {
    this.props.navigation.navigate('Calendar');
  }

  render() {
    // TODO: Show a picture of the org.
    return (
      <Container>
        <Content>
          <ClickCard arrowText="Calendar"
                     onPress={() => this._onCalendarView()}>
            <Text>
              Today is an A day
            </Text>
          </ClickCard>
        </Content>
      </Container>
    );
  }
}
