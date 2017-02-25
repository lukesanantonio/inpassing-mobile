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

  constructor(props) {
    super(props);

    this.state = {
      greeting: null,
    };
  }

  getOrg() {
    return this.props.org || this.props.navigation.state.params.org;
  }

  getCursor() {
    return this.props.cursor || this.props.navigation.state.params.cursor;
  }

  _onCalendarView() {
    this.props.navigation.navigate('Calendar');
  }

  componentDidMount() {
    var cursor = this.getCursor();
    cursor.getOrgCurrentDaystate(this.getOrg().id).then((ds) => {
      this.setState({greeting: ds.greeting});
    }).catch((err) => {
      // Failed to get the current daystate.
      this.setState({greeting: 'Failed to get the current daystate'});
    });
  }

  render() {
    // TODO: Show a picture of the org.
    return (
      <Container>
        <Content>
          <ClickCard arrowText="Calendar"
                     onPress={() => this._onCalendarView()}>
            <Text>
              {this.state.greeting}
            </Text>
          </ClickCard>
        </Content>
      </Container>
    );
  }
}
