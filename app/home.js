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
  cardBody: {
    flex: 15,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  cardIcon: {
    flex: 1,
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

const style_cardBody = StyleSheet.flatten(styles.cardBody);
const style_cardIcon = StyleSheet.flatten(styles.cardIcon);

// TODO: Put this in a pass util somewhere
function passIsValidated(pass) {
  return !!pass.assignedTime;
}
function passIsPending(pass) {
  return !pass.assignedTime;
}

export class PassView extends Component {
  render() {
    var resolvedPass = this.props.resolvedPass ||
                       this.props.navigation.state.params.resolvedPass;
    return <Text>Pass ID {resolvedPass.pass.id}</Text>;
  }
}

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
          // Resolve the org name, and both daystates.
          // If one of the daystates is undefined, we will get null back.
          Promise.all([
            cursor.getOrgById(pass.orgId),
            cursor.getDaystateById(pass.orgId, pass.assignedStateId),
            cursor.getDaystateById(pass.orgId, pass.requestedStateId),
          ]).then((values) => {
            var resolvedPasses = this.state.resolvedPasses;

            // This technically changes state anyway, so beware of race
            // conditions.
            resolvedPasses[pass.id] = {
              pass,
              org: values[0],
              assignedState: values[1],
              requestedState: values[2],
            }
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
        return <PassView resolvedPass={pass} />
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

  _onPressPass(resolvedPass) {
    this.props.navigation.navigate('PassView', {resolvedPass});
  }

  _renderPassDescription(resolvedPass) {
    if(passIsValidated(resolvedPass.pass)) {
      // Render a regular pass that the user owns
      return (
        <Text style={styles.cardSpot}>
          {resolvedPass.pass.assignedSpotNum}-{resolvedPass.assignedState.identifier}
        </Text>
      );
    }
    else {
      // Render a pending pass
      return (
        <Text style={styles.cardSpot}>
          {resolvedPass.pass.requestedSpotNum}-{resolvedPass.requestedState.identifier} (Pending)
        </Text>
      );
    }
  }

  renderCard(resolvedPass) {
    return (
      <Card key={resolvedPass.pass.id}>
        <CardItem header button onPress={() => {this._onPressPass(resolvedPass)}}>
          <Body style={style_cardBody}>
            <View style={styles.cardSpotContainer}>
              {this._renderPassDescription(resolvedPass)}
            </View>
            <View style={styles.cardOrgContainer}>
              <Text style={styles.cardOrg}>
                {resolvedPass.org.name}
              </Text>
            </View>
          </Body>
          <Right style={style_cardIcon}>
            <Icon name="arrow-forward"/>
          </Right>
        </CardItem>
      </Card>
    );
  }
}
