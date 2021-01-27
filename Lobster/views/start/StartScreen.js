import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  START_SIGN_IN_ROUTE,
  START_SIGN_UP_ROUTE,
} from '../../navigation/routes';

function StartScreen({navigation}) {
  return (
    <View style={styles.view}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(START_SIGN_IN_ROUTE)}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <View style={styles.break}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.line} />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(START_SIGN_UP_ROUTE)}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  buttonContainer: {
    marginTop: 100,
  },
  button: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 16,
    alignSelf: 'center',
    textAlignVertical: 'center',
    paddingVertical: 10,
    height: 85,
  },
  break: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  line: {
    height: 1,
    backgroundColor: 'black',
    opacity: 0.2,
    width: '43%',
    alignSelf: 'center',
  },
  orText: {
    textTransform: 'uppercase',
    marginHorizontal: 10,
    opacity: 0.8,
    fontSize: 12,
  },
  title: {
    textAlign: 'left',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B088E',
  },
});

export default StartScreen;
