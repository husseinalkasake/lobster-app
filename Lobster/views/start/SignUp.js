import { Form, Item, Input, Label, Button } from 'native-base';
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  START_SIGN_IN_ROUTE,
} from '../../navigation/routes';
import {connect} from 'react-redux';
import lobsterController from '../../controller/LobsterController';
import { updateEmail, updateName, updateHeight, signInUser } from '../../redux/actions';

class SignUp extends React.Component {
    state = {
        password: "",
        confirmPassword: "",
        error: "",
    }

    isValid() {
        const {password, confirmPassword} = this.state;
        const {email, name, height} = this.props;
        const isValid = [email, name, height, password, confirmPassword].every(val => val !== "" && val !== null);
        this.setState({error: isValid ? "" : "Invalid Fields. Please try again."});
        return isValid;
    }

    register() {
      if (!this.isValid()) return;

      const {name, email, height} = this.props;
      lobsterController.createUser(name, email, height)
      .then(response => {
          if (response.data) {
           const user = response.data.user;
           if (user) {
             this.props.signInUser(user.id, user.height, user.name);
             this.setState({error: ""});
          } else {
            this.setState({error: "Unable to fetch user data. Please try again."});
          }
         }
      })
      .catch(error => {
        this.setState({error: `Unable to sign up. ${error.response.data.message}`});
      });
    }
    
    render() {
        const {password, confirmPassword, error} = this.state;
        const {email, name, updateEmail, updateHeight, updateName, height, navigation, keyboardShowing} = this.props;
        return (
            <View style={styles.view}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Sign Up</Text>
                <View style={styles.form}>
                    <Form>
                        <Item style={styles.item} stackedLabel>
                            <Label style={styles.itemLabel}>E-mail address</Label>
                            <Input style={styles.input} value={email} onChangeText={text => updateEmail(text)}/>
                        </Item>
                    </Form>
                    <Form>
                        <Item style={styles.item} stackedLabel>
                            <Label style={styles.itemLabel}>Name</Label>
                            <Input style={styles.input} value={name} onChangeText={text => updateName(text.trim())}/>
                        </Item>
                    </Form>
                    <Form>
                        <Item style={styles.item} stackedLabel>
                            <Label style={styles.itemLabel}>Height (cm)</Label>
                            <Input keyboardType="number-pad" style={styles.input} value={height.toString()} onChangeText={text => updateHeight(Number(text.replace(/\D/g, "").toString()))}/>
                        </Item>
                    </Form>
                    <Form>
                        <Item style={styles.item} stackedLabel>
                            <Label style={styles.itemLabel}>Password</Label>
                            <Input style={styles.input} secureTextEntry={true} value={password} onChangeText={password => this.setState({password})}/>
                        </Item>
                    </Form>
                    <Form>
                        <Item style={styles.item} stackedLabel>
                            <Label style={styles.itemLabel}>Confirm Password</Label>
                            <Input style={styles.input} secureTextEntry={true} value={confirmPassword} onChangeText={confirmPassword => this.setState({confirmPassword})}/>
                        </Item>
                    </Form>
                </View>
                <Button style={{width: '100%', justifyContent: 'center', marginTop: '20%'}} disabled={!(!!password && !!confirmPassword && password === confirmPassword)} onPress={() => this.register()}>
                    <Label style={{color: 'white'}}>Register</Label>
                </Button>
                {error !== "" && (
                  <Text style={{color: 'red', fontWeight: 'bold', fontSize: 12, alignSelf: 'center', marginTop: '5%'}}>{error}</Text>
                )}
            </View>
            {!keyboardShowing && (
              <TouchableOpacity style={{width: '100%', position: 'absolute', bottom: '5%'}} onPress={() => navigation.navigate(START_SIGN_IN_ROUTE)}>
                <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Already have an account?</Text>
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
  name: state.name,
  height: state.height,
  keyboardShowing: state.keyboardShowing
});

const mapDispatchToProps = (dispatch) => ({
	updateEmail: (email) => dispatch(updateEmail(email)),
	updateName: (name) => dispatch(updateName(name)),
	updateHeight: (height) => dispatch(updateHeight(height)),
  signInUser: (userId, height, name) => dispatch(signInUser(userId, height, name)), 
});
  
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
