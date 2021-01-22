import { Form, Item, Input, Label, Button } from 'native-base';
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import {
  START_SIGN_UP_ROUTE,
} from '../../navigation/routes';
import {connect} from 'react-redux';
import { updateEmail, updatePassword } from '../../redux/actions';
import LobsterController from '../../controller/LobsterController';

function SignIn({email, password, updateEmail, updatePassword, navigation, keyboardShowing}) {
  const signIn = () => {
    LobsterController.getUser(email)
    .then(response => {
        if (response.data.status) {
         console.log(response);
       } 
    })
    .catch(error => {
        console.log(error);
    });
  };
  return (
    <View style={styles.view}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.form}>
            <Form>
                <Item style={styles.item} stackedLabel>
                    <Label style={styles.itemLabel}>E-mail address</Label>
                    <Input style={styles.input} value={email} onChangeText={text => updateEmail(text)}/>
                </Item>
            </Form>
            <Form>
                <Item style={styles.item} stackedLabel>
                    <Label style={styles.itemLabel}>Password</Label>
                    <Input style={styles.input} secureTextEntry={true} value={password} onChangeText={text => updatePassword(text)}/>
                </Item>
            </Form>
        </View>
        <Button style={{width: '100%', justifyContent: 'center', marginTop: '20%'}} onPress={() => signIn()}>
          <Label style={{textTransform: 'uppercase', color: 'white'}}>Sign in</Label>
        </Button>
        <Text style={{color: 'red', fontWeight: 'bold', fontSize: 12, alignSelf: 'center', marginTop: '5%'}}>{"No matching account found. Please try again."}</Text>
        <TouchableOpacity style={{width: '100%', marginTop: '10%'}}>
          <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      {!keyboardShowing && (
        <TouchableOpacity style={{width: '100%', position: 'absolute', bottom: '5%'}} onPress={() => navigation.navigate(START_SIGN_UP_ROUTE)}>
          <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Don't have an account?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '80%',
    position: 'absolute',
    top: '25%',
  },
  form: {
    width: '100%',
    marginTop: 25
  },
  item: {
    marginLeft: 0
  },
  itemLabel: {
    fontSize: 12
  },
  input: {
    paddingLeft: 0
  },
  title: {
    textAlign: 'left',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
  },
});

const mapStateToProps = (state) => ({
  email: state.email,
  password: state.password,
  keyboardShowing: state.keyboardShowing
});

const mapDispatchToProps = (dispatch) => ({
	updateEmail: (email) => dispatch(updateEmail(email)),
	updatePassword: (password) => dispatch(updatePassword(password)),
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
