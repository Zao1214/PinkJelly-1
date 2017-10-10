import React, { Component } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import * as firebase from 'firebase';
import Paw from '../components/Paw';

export default class SignUp extends Component{
  state = {
    email: '',
    password: '',
    emailType: true,
    passwordType: true,
    confirmPasswordType: true,
  };

  onSignUp() {
    const { email, password } = this.state;
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

    if (email !== '' && password !== '') {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          user.sendEmailVerification();
          alert('Please, verify your email address.');
        })
        .catch(error => {
          (error.code === 'auth/weak-password')
            ? alert('The password is too weak.')
            : alert(error.message);
          console.log(error);
        });
    }
  }

  onConfirmPassword(confirmPassword) {
    const { password, confirmPasswordType } = this.state;
    if (password !== confirmPassword) {
      this.setState({
        confirmPasswordType: false,
      });
    } else {
      this.setState({
        confirmPasswordType: true,
      });
    }
  }

  render() {
    const { emailType, passwordType, confirmPasswordType } = this.state;
    const { setSignPage } = this.props;
    return (
      <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
        <ScrollView contentContainerStyle={styles.signUpContainer}>
          <View style={styles.logoDistrict}>
            <Paw />
          </View>
          <View style={styles.signupForm}>
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
            <FormInput
              onChangeText={value => this.onConfirmPassword(value)}
              placeholder="CONFIRM PASSWORD"
              placeholderTextColor="#fff"
              containerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              secureTextEntry
            />
            {(!confirmPasswordType)
              ? <FormValidationMessage>Incorrect Password</FormValidationMessage>
              : null
            }
            <View style={styles.buttonWrapper}>
              <Button
                small
                onPress={() => this.onSignUp()}
                title="SIGN UP"
                buttonStyle={styles.buttonStyle}
                backgroundColor="transparent"
                color="#fff"/>
              <Text onPress={() => setSignPage()} style={styles.backToSignIn}>BACK TO SIGNIN</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#82b1ff',
  },
  signUpContainer: {
    flex: 1,
  },
  logoDistrict: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  signupForm: {
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
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 100,
  },
  backToSignIn: {
    textAlign: 'center',
    color: '#555',
  },
});

SignUp.propTypes = {
  setSignPage: PropTypes.func,
};
