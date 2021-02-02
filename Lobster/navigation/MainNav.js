import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {MAIN_TABS_ROUTE, MAIN_WORK_SESSION_ROUTE } from "./routes";
import MainTabs from "./MainTabs";
import WorkSession from './WorkSession';

export default function MainNav() {
    const MainStack = createStackNavigator();

	return (
		<MainStack.Navigator initialRouteName={MAIN_TABS_ROUTE}>
			<MainStack.Screen
          	name={MAIN_TABS_ROUTE}
          	component={MainTabs}
          	options={{headerShown: false}}
        	/>
			<MainStack.Screen
          	name={MAIN_WORK_SESSION_ROUTE}
          	component={WorkSession}
          	options={{headerShown: false}}
        	/>
		</MainStack.Navigator>
	);
}
