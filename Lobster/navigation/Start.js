import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import StartScreen from '../views/start/StartScreen';
import {START_WELCOME_ROUTE, START_INTRO_ROUTE} from './routes';

export default class Start extends React.Component {
  render() {
    const StartStack = createStackNavigator();
    return (
      <StartStack.Navigator initialRouteName={START_WELCOME_ROUTE}>
        <StartStack.Screen
          name={START_INTRO_ROUTE}
          component={StartScreen}
          options={{headerShown: false}}
        />
      </StartStack.Navigator>
    );
  }
}
