import React, { Component } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Animatable from 'react-native-animatable';
import SignUp from './SignUp';
import Paw from '../components/Paw';

export default class SignIn extends Component{
  state = {
    email: '',
    password: '',
    emailType: true,
    passwordType: true,
    register: false,
    processing: false,
  };

  onSignIn() {
    const { email, password } = this.state;
    const { onVerifyEmail, onCheckLoggedIn } = this.props;
    if (email === '') {
      this.setState({
        emailType: false,
      });
    } else {
      this.setState({
        emailType: true,
      });
    }

    if (password === '') {
      this.setState({
        passwordType: false,
      });
    } else {
      this.setState({
        passwordType: true,
      });
    }

    this.setState({
      processing: true,
    });

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        if (!user.emailVerified) {
          onVerifyEmail();
        } else {
          onCheckLoggedIn();
        }
      })
      .catch(err => {
        alert(err);
        this.setState({
          processing: false,
        });
      });
  }

  setSignPage() {
    this.setState({
      emailType: true,
      passwordType: true,
      register: !this.state.register,
    });
  }

  render() {
    const { register, emailType, passwordType, processing } = this.state;
    if (register) {
      return <SignUp setSignPage={this.setSignPage.bind(this)}/>;
    } else {
      return (
        <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
          <ScrollView contentContainerStyle={styles.signInContainer}>
            <View style={styles.logoDistrict}>
              <Paw />
            </View>
            <View style={styles.loginForm}>
              <FormInput
                onChangeText={value => this.setState({ email: value })}
                placeholder="EMAIL ADDRESS"
                placeholderTextColor="#fff"
                containerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
              />
              {(!emailType)
                ? <FormValidationMessage>Enter Email</FormValidationMessage>
                : null
              }
              <FormInput
                onChangeText={value => this.setState({ password: value })}
                placeholder="PASSWORD"
                placeholderTextColor="#fff"
                containerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                secureTextEntry
              />
              {(!passwordType)
                ? <FormValidationMessage>Enter Password</FormValidationMessage>
                : null
              }
              {(!processing)
                ? (<View style={styles.buttonWrapper}>
                    <Button
                      small
                      onPress={() => this.onSignIn()}
                      title="SIGN IN"
                      buttonStyle={styles.buttonStyle}
                      backgroundColor="transparent"
                      color="#fff"/>
                    <Text onPress={() => this.setSignPage()} style={styles.signUp}>NEW ACCOUNT</Text>
                  </View>)
                : (<View style={styles.buttonWrapper}>
                    <ActivityIndicator color="#fff" size="large" />
                  </View>)
              }
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#82b1ff',
  },
  signInContainer: {
    flex: 1,
  },
  logoDistrict: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  loginForm: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainerStyle: {
    marginBottom: 16,
    borderBottomColor: '#fff',
  },
  inputStyle: {
    paddingVertical: 12,
    color: '#222',
    fontWeight: '100',
  },
  buttonWrapper: {
    marginTop: 16,
  },
  buttonStyle: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 100,
  },
  signUp: {
    textAlign: 'center',
    color: '#555',
  },
});

SignIn.propTypes = {
  onVerifyEmail: PropTypes.func,
  onCheckLoggedIn: PropTypes.func,
};
