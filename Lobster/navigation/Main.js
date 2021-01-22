import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../views/main/Home';
import {
    MAIN_HOME_ROUTE
} from './routes';

export default class Main extends React.Component {
  render() {
    const MainStack = createStackNavigator();
    return (
      <MainStack.Navigator initialRouteName={MAIN_HOME_ROUTE}>
        <MainStack.Screen
          name={MAIN_HOME_ROUTE}
          component={Home}
          options={{headerShown: false}}
        />
      </MainStack.Navigator>
    );
  }
}
