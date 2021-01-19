import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

class StartScreen extends React.Component {
  render() {
    debugger;
    return (
      <View style={styles.view}>
        <Text style={styles.text}>Startttt Screen</Text>
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
  text: {},
});

export default StartScreen;
