import { Form, Item, Input, Label, Button } from 'native-base';
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  START_SIGN_IN_ROUTE,
  START_GENERAL_INFORMATION_ROUTE
} from '../../navigation/routes';
import {connect} from 'react-redux';
import { updateEmail, updatePassword, updateFirstName, updateLastName } from '../../redux/actions';

class SignUp extends React.Component {
    state = {
        password: "",
        confirmPassword: "",
        error: "",
    }

    isValid() {
        const {password, confirmPassword} = this.state;
        const {email, firstName, lastName} = this.props;
        const isValid = [email, firstName, lastName, password, confirmPassword].every(val => val !== "" && val !== null);
        this.setState({error: isValid ? "" : "No matching account found. Please try again."});
        return isValid;
    }

    signUp() {
      
    }
    
    render() {
        const {password, confirmPassword, error} = this.state;
        const {email, firstName, lastName, updateEmail, updateFirstName, updateLastName, navigation, keyboardShowing} = this.props;
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
                            <Label style={styles.itemLabel}>First Name</Label>
                            <Input style={styles.input} value={firstName} onChangeText={text => updateFirstName(text)}/>
                        </Item>
                    </Form>
                    <Form>
                        <Item style={styles.item} stackedLabel>
                            <Label style={styles.itemLabel}>Last Name</Label>
                            <Input style={styles.input} value={lastName} onChangeText={text => updateLastName(text)}/>
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
                <Button style={{width: '100%', justifyContent: 'center', marginTop: '20%'}} disabled={!(!!password && !!confirmPassword && password === confirmPassword)} onPress={() => this.isValid() && this.props.updatePassword(password) && navigation.navigate(START_GENERAL_INFORMATION_ROUTE)}>
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
  firstName: state.firstName,
  lastName: state.lastName,
  keyboardShowing: state.keyboardShowing
});

const mapDispatchToProps = (dispatch) => ({
	updateEmail: (email) => dispatch(updateEmail(email)),
	updatePassword: (password) => dispatch(updatePassword(password)),
	updateFirstName: (firstName) => dispatch(updateFirstName(firstName)),
	updateLastName: (lastName) => dispatch(updateLastName(lastName)),
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
