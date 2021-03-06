import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WorkSessionPage from '../views/work_session/WorkSession';
import DeskConnect from '../views/work_session/DeskConnect';
import {
  WORK_SESSION_DESK_CONNECT_ROUTE,
  WORK_SESSION,
} from './routes';

export default class WorkSession extends React.Component {
  render() {
    const WorkSessionStack = createStackNavigator();
    return (
      <WorkSessionStack.Navigator initialRouteName={WORK_SESSION_DESK_CONNECT_ROUTE}>
      <WorkSessionStack.Screen
        name={WORK_SESSION_DESK_CONNECT_ROUTE}
        component={DeskConnect}
        options={{headerShown: false}}
      />
        <WorkSessionStack.Screen
          name={WORK_SESSION}
          component={WorkSessionPage}
          options={{headerShown: false}}
        />
      </WorkSessionStack.Navigator>
    );
  }
}
