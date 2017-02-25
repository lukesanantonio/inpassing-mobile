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
  Button,
} from 'native-base';

import ClickCard from './views/ClickCard';

import {Pass} from './backend';

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
  },
  borrowButton: {
    margin: 1,
    marginTop: 2,
  },
  borrowButtonText: {
    color: 'white',
  }
});

const style_borrowButton = StyleSheet.flatten(styles.borrowButton);

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
    } else {
      // Render passes as cards. Originally, if there was one pass the pass view
      // was rendered instead of this card list but that wouldn't allow the user
      // to borrow a pass on the days that they can't use that one pass that
      // they have. Maybe in the future we can check for this specifically and
      // show a borrow button only when only one pass is being presented.
      return (
        <Container>
          <Content>
            {Object.keys(this.state.resolvedPasses).map(passId => {
               var pass = this.state.resolvedPasses[passId];
               return this.renderCard(pass)
             })}
            <Button block style={style_borrowButton}>
              <Text style={styles.borrowButtonText}>Borrow a pass</Text>
            </Button>
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
