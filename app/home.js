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
  View,
} from 'react-native';

import {
  Container,
  Content,
} from 'native-base';

import ClickCard from './views/ClickCard';

import {Pass} from './backend';
import {PassView} from './pass-view';

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardOrg: {
    fontSize: 16,
  },
  cardOrgContainer: {
    flex: 3,
  },
  cardSpot: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left'
  },
  cardSpotContainer: {
    flex: 2,
  }
});

export class OrgView extends Component {
  render() {
    return <Text>I'm an org</Text>;
  }
}

export class OrgHome extends Component {
  static navigationOptions = {
    tabBar: {
      label: "Organizations"
    }
  }

  render() {
    return <Text>Hello</Text>;
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
      me: null,
      resolvedPasses: {},
    };
  }
  componentDidMount() {
    // Start requesting /me
    var {cursor} = this.props.navigation.state.params;
    if(cursor) {
      cursor.me().then((user) => {
        this.setState({me: user});
        return user.passes;
      }).then((passes) => {
        passes.forEach((pass) => {
          pass.resolve(cursor).then((resolved) => {
            var resolvedPasses = this.state.resolvedPasses;

            // This technically changes state anyway, so beware of race
            // conditions.
            resolvedPasses[pass.id] = resolved;
            this.setState({resolvedPasses});
          });
        });
      });
    }
  }
  render() {
    if (this.state.me === null) {
      // Show a spinner
      return <ActivityIndicator style={styles.centered}
                                animating={true}
                                size={60} />;
    } else if (Object.keys(this.state.resolvedPasses).length == 1) {
      // If the user only has one pass, show it here
      return Object.keys(this.state.resolvedPasses).map(passId => {
        // This will be only called once
        var pass = this.state.resolvedPasses[passId];
        return <PassView pass={pass} />
      })[0];
    } else {
      // Otherwise render them as cards
      return (
        <Container>
          <Content>
            {Object.keys(this.state.resolvedPasses).map(passId => {
               var pass = this.state.resolvedPasses[passId];
               return this.renderCard(pass)
             })}
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
      <ClickCard style={styles.passCard} key={pass.id}
                 onPress={() => this._onPressPass(pass)}>
        <View style={styles.cardSpotContainer}>
          <Text style={styles.cardSpot}>
            {pass.spotString()}
          </Text>
        </View>
        <View style={styles.cardOrgContainer}>
          <Text style={styles.cardOrg}>
            {pass.org.name}
          </Text>
        </View>
      </ClickCard>
    );
  }
}
