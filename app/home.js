/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native';

import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Right,
  Icon
} from 'native-base';

import {Pass} from './backend';

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: 20, fontWeight: 'bold', color: 'black'
  },
  cardContent: {
    fontSize: 16
  }
});

export class PassView extends Component {
  render() {
    var {pass} = this.props.navigation.state.params;
    return (
      <View style={{flex: 1}}>
        <Text>Pass ID {pass.id}</Text>
      </View>
    );
  }
}

export class OrgView extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Text>I'm an org</Text>
      </View>
    );
  }
}

export class OrgHome extends Component {
  static navigationOptions = {
    tabBar: {
      label: "Organizations"
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Hello</Text>
      </View>
    );
  }
}

export class PassHome extends Component {
  static navigationOptions = {
    tabBar: {
      label: "Passes"
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      me: null
    };
  }
  componentDidMount() {
    // Start requesting /me
    var {cursor} = this.props.navigation.state.params;
    if(cursor) {
      cursor.me().then((user) => {
        this.setState({me: user});
      });
    }
  }
  render() {
    if (this.state.me === null) {
      // Show a spinner
      return <ActivityIndicator style={styles.centered}
                                animating={true}
                                size={60} />;
    } else {
      // Show the current user
      return (
        <Container>
          <Content>
            {this.state.me.passes.map(p => this.renderCard(p))}
          </Content>
        </Container>
      );
    }
  }

  _onPressPass(pass) {
    this.props.navigation.navigate('PassView', {pass});
  }

  renderCard(pass) {
    return (
      <Card key={pass.id}>
        <CardItem header button onPress={() => {this._onPressPass(pass)}}>
          <Body style={{flex: 9, alignItems: 'stretch'}}>
            <View>
              <Text style={styles.cardTitle}>
                High School
              </Text>
            </View>
            <View>
              <Text style={styles.cardContent}>
                {pass.spotNum}-{pass.stateId}
              </Text>
            </View>
          </Body>
          <Right style={{flex: 1}}>
            <Icon name="arrow-forward"/>
          </Right>
        </CardItem>
      </Card>
    );
  }
}
