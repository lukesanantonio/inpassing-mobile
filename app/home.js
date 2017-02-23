/*
 * Copyright (C) 2017 Luke San Antonio Bialecki
 * All rights reserved.
 */

'use strict';

import React, {Component} from 'react';
import {Text, Navigator} from 'react-native';
import {Auth} from './auth';

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export class OrgHome extends Component {
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
    }
    // Show the current user
    return (<Text>
  Hello {this.state.me.firstName} {this.state.me.lastName} ({this.state.me.id})!
    </Text>);
  }
}
