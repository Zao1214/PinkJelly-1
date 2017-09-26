import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, KeyboardAvoidingView  } from 'react-native';
import PropTypes from 'prop-types';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Animatable from 'react-native-animatable';
import SignUp from './SignUp';
import Loading from '../components/Loading';
import Paw from '../components/Paw';

export default class SignIn extends Component{
  state = {
    email: '',
    password: '',
    emailType: true,
    passwordType: true,
    register: false,
  };

  onSignIn() {
    const { email, password } = this.state;
    const { onVerifyEmail, onCheckLoggedIn } = this.props;
    if (email === '') {
       this.setState({emailType: false})
    } else {
       this.setState({emailType: true})
    }

    if (password === '') {
      this.setState({passwordType: false})
    } else {
      this.setState({passwordType: true})
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        if (!user.emailVerified) {
          onVerifyEmail();
        } else {
          onCheckLoggedIn();
        }
      })
      .catch(err => console.log(err));
  }

  setSignPage() {
    this.setState({
      emailType: true,
      passwordType: true,
      register: !this.state.register,
    });
  }

  render() {
    const { register, emailType, passwordType } = this.state;
    if (register) {
      return <SignUp setSignPage={this.setSignPage.bind(this)}/>;
    } else {
      return (
        <KeyboardAvoidingView style={styles.signInContainer} behavior="padding">
          <View style={styles.logoDistrict}>
            <Paw />
          </View>
          <View style={styles.loginForm}>
            <FormInput
              onChangeText={value => {this.setState({email: value})}}
              placeholder="EMAIL ADDRESS"
              placeholderTextColor="#00796b"
              containerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
            />
            {(!emailType)
              ? <FormValidationMessage>Email을 입력해주세요</FormValidationMessage>
              : null
            }
            <FormInput
              onChangeText={value => this.setState({password: value})}
              placeholder="PASSWORD"
              placeholderTextColor="#00796b"
              containerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              secureTextEntry
            />
            {(!passwordType)
              ? <FormValidationMessage>Password을 입력해주세요</FormValidationMessage>
              : null
            }

            <Button small onPress={() => this.onSignIn()} title="SIGN IN" buttonStyle={styles.buttonStyle} backgroundColor="transparent" color="#00796b"/>
            <Text onPress={() => this.setSignPage()} style={styles.signUp}>NEW ACCOUNT</Text>
          </View>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  signInContainer: {
    flex: 1,
    backgroundColor: '#64ffda',
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
    borderBottomColor: '#00796b',
  },
  inputStyle: {
    color: '#222',
    fontWeight: '100',
  },
  buttonStyle: {
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#00796b',
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
