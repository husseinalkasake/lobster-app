import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WorkSessionPage from '../views/work_session/WorkSession';
import {
  WORK_SESSION
} from './routes';

export default class WorkSession extends React.Component {
  render() {
    const WorkSessionStack = createStackNavigator();
    return (
      <WorkSessionStack.Navigator initialRouteName={WORK_SESSION}>
        <WorkSessionStack.Screen
          name={WORK_SESSION}
          component={WorkSessionPage}
          options={{headerShown: false}}
        />
      </WorkSessionStack.Navigator>
    );
  }
}
