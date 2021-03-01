import { Form, Item, Input, Label, Button } from 'native-base';
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  START_SIGN_UP_ROUTE,
  MAIN_HOME_ROUTE,
} from '../../navigation/routes';
import {connect} from 'react-redux';
import { updateEmail, signInUser } from '../../redux/actions';
import lobsterController from '../../controller/LobsterController';

class SignIn extends React.Component {
  state = {
    password: "",
    error: "",
  }
  
  signIn() {
    lobsterController.getUser(this.props.email)
    .then(response => {
        const user = response.data.user;
        if (user) {
          this.props.signInUser(user.id, user.height, user.name);
          this.setState({error: ""});
          this.props.navigation.navigate(MAIN_HOME_ROUTE);
       } else {
         this.setState({error: "Unable to fetch user data. Please try again."});
       }
    })
    .catch(() => {
        this.setState({error: "Unable to log in. Please try again."});
    });
  }

  render() {
    const {email, password, updateEmail, navigation, keyboardShowing} = this.props;
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
                      <Input style={styles.input} secureTextEntry={true} value={password} onChangeText={password => this.setState({password})}/>
                  </Item>
              </Form>
          </View>
          <Button style={{width: '100%', justifyContent: 'center', marginTop: '20%'}} onPress={() => this.signIn()}>
            <Label style={{textTransform: 'uppercase', color: 'white'}}>Sign in</Label>
          </Button>
          <Text style={{color: 'red', fontWeight: 'bold', fontSize: 12, alignSelf: 'center', marginTop: '5%'}}>{this.state.error}</Text>
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
    color: '#2B088E',
  },
});

const mapStateToProps = (state) => ({
  email: state.email,
  keyboardShowing: state.keyboardShowing
});

const mapDispatchToProps = (dispatch) => ({
	updateEmail: (email) => dispatch(updateEmail(email)),
  signInUser: (userId, height, fullName) => dispatch(signInUser(userId, height, fullName)), 
});
  
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);