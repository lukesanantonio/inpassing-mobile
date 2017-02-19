import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput, Button} from 'react-native';

import Backend from './backend';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  render() {
    return (
      <View>
        <TextInput placeholder='Email'
                   onChangeText={(text) => { this.setState({email: text})}}
                   value={this.state.email}
                   keyboardType='email-address'/>
        <TextInput placeholder='Password'
                   onChangeText={(text) => { this.setState({password: text})}}
                   value={this.state.password}
                   secureTextEntry={true}/>
        <Button title='Login'
                onPress={() => { this.props.onLogin(this.state.email,
                                                    this.state.password) } } />
        <Text>Need an account?</Text>
        <Button title='Sign up'
                onPress={this.props.onSwitch} />
      </View>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onSwitch: PropTypes.func.isRequired
}

export class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
  }

  render() {
    return (
      <View>
        <TextInput placeholder='First name'
                   onChangeText={(text) => { this.setState({firstName: text})}}
                   value={this.state.firstName} />
        <TextInput placeholder='Last name'
                   onChangeText={(text) => { this.setState({lastName: text})}}
                   value={this.state.lastName} />
        <TextInput placeholder='Email'
                   onChangeText={(text) => { this.setState({email: text})}}
                   value={this.state.email}
                   keyboardType='email-address'/>
        <TextInput placeholder='Password'
                   onChangeText={(text) => { this.setState({password: text})}}
                   value={this.state.password}
                   secureTextEntry={true}/>
        <Button title='Sign up'
                onPress={() => { this.props.onSignup(this.state.firstName,
                                                     this.state.lastName,
                                                     this.state.email,
                                                     this.state.password) } } />
        <Text>Already have an account?</Text>
        <Button title='Login'
                onPress={this.props.onSwitch} />
      </View>
    );
  }
}

Signup.propTypes = {
  onSignup: PropTypes.func.isRequired,
  onSwitch: PropTypes.func.isRequired,
}

export class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: Login
    };
  }

  _onLogin(email, password) {
    // TODO Add a visual indicator for the time that we are making the request.
    // Try to authenticate.
    Backend.auth(email, password).then((cursor) => {
      alert('token: ' + cursor.token);
    }).catch((err) => {
      alert('Failed to authenticate: ' + err);
    });
  }

  _onSignup() {
    // Sign up
    alert(firstName);
  }

  _onSwitch(comp) {
    if (comp.state.mode === Login) {
      comp.setState({mode: Signup});
    } else if (comp.state.mode === Signup) {
      comp.setState({mode: Login});
    }
  }

  render() {
    return <this.state.mode onLogin={this._onLogin} onSignup={this._onSignup}
                            onSwitch={() => {this._onSwitch(this)} } />
  }
}
