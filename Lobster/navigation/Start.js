import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import StartScreen from '../views/start/StartScreen';
import SignIn from '../views/start/SignIn';
import SignUp from '../views/start/SignUp';
import GeneralInfo from '../views/start/GeneralInfo';
import {
  START_INTRO_ROUTE,
  START_SIGN_IN_ROUTE,
  START_SIGN_UP_ROUTE,
  START_GENERAL_INFORMATION_ROUTE
} from './routes';

export default class Start extends React.Component {
  render() {
    const StartStack = createStackNavigator();
    return (
      <StartStack.Navigator initialRouteName={START_INTRO_ROUTE}>
        <StartStack.Screen
          name={START_INTRO_ROUTE}
          component={StartScreen}
          options={{headerShown: false}}
        />
        <StartStack.Screen
          name={START_SIGN_IN_ROUTE}
          component={SignIn}
          options={{headerShown: false}}
        />
        <StartStack.Screen
          name={START_SIGN_UP_ROUTE}
          component={SignUp}
          options={{headerShown: false}}
        />
        <StartStack.Screen
          name={START_GENERAL_INFORMATION_ROUTE}
          component={GeneralInfo}
          options={{headerShown: false}}
        />
      </StartStack.Navigator>
    );
  }
}
