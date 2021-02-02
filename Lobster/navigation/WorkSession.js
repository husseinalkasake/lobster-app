import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import NewWorkSession from '../views/work_session/NewWorkSession';
import {
    MAIN_NEW_WORK_SESSION
} from './routes';

export default class WorkSession extends React.Component {
  render() {
    const WorkSessionStack = createStackNavigator();
    return (
      <WorkSessionStack.Navigator initialRouteName={MAIN_NEW_WORK_SESSION}>
        <WorkSessionStack.Screen
          name={MAIN_NEW_WORK_SESSION}
          component={NewWorkSession}
          options={{headerShown: false}}
        />
      </WorkSessionStack.Navigator>
    );
  }
}
