import { Form, Item, Input, Label, Button } from 'native-base';
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import { logOut } from '../../redux/actions';

function PersonalProfile({name, email, height, logOut}) {
    return (
        <View style={styles.view}>
          <View style={{position: 'absolute', top: 0, marginVertical: 12, width: '100%'}}>
            <Text style={styles.appTitle}>Lobster 🦞</Text>
            <TouchableOpacity
            style={styles.button}
            onPress={() => logOut()}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.innerContainer}>
              <Text style={styles.title}>Personal Profile</Text>
              <View style={styles.form}>
                <View style={{marginVertical: 48}}>
                  <Label style={{position: 'absolute', left: 0, fontWeight: 'bold'}}>Name</Label>
                  <Label style={{position: 'absolute', right: 0}}>{name}</Label>
                </View>
                <View style={{marginVertical: 48}}>
                  <Label style={{position: 'absolute', left: 0, fontWeight: 'bold'}}>Email</Label>
                  <Label style={{position: 'absolute', right: 0}}>{email}</Label>
                </View>
                <View style={{marginVertical: 48}}>
                  <Label style={{position: 'absolute', left: 0, fontWeight: 'bold'}}>Height</Label>
                  <Label style={{position: 'absolute', right: 0}}>{height} cm</Label>
                </View>
              </View>
          </View>
          <Text style={{position: 'absolute', bottom: '5%', justifyContent: 'center', fontWeight: 'bold', fontSize: 12}}>MADE WITH <Text style={{fontSize: 10}}>❤️</Text></Text>
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
    color: '#2B088E',
  },
  appTitle: {
    color: 'black',
    fontSize: 24,
    position: 'absolute',
    left: 24,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  button: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    position: 'absolute',
    right: 24,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 14,
    alignSelf: 'center',
    textAlignVertical: 'center',
    padding: 10,
  },
});

const mapStateToProps = (state) => ({
  name: state.name,
  email: state.email,
  height: state.height,
});

const mapDispatchToProps = (dispatch) => ({
  logOut: () => dispatch(logOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalProfile);
