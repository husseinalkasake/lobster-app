import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Home from "../views/main/Home";
import Statistics from "../views/main/Statistics";
import Settings from "../views/main/Settings";
import routes from "./routes";

export default function MainNav() {
	const Tab = createBottomTabNavigator();

	return (
		<Tab.Navigator
			initialRouteName={routes.MAIN_HOME_ROUTE}
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					switch (route.name) {
            case routes.MAIN_STATISTICS_ROUTE:
              iconName = focused ? "equalizer" : "equalizer-outline";
              break;
            case routes.MAIN_SETTINGS_ROUTE:
              iconName = focused ? "account-supervisor" : "account-supervisor-outline";
              break;
						default:
              iconName = focused ? "home" : "home-outline";
							break;
					}

					return (
						<Icon name={iconName} size={size} color={color} />
					);
				},
			})}
			tabBarOptions={{
				activeTintColor: "black",
				inactiveTintColor: "gray",
				showLabel: false,
			}}>
			<Tab.Screen
				name={routes.MAIN_HOME_ROUTE}
				component={Home}
			/>
			<Tab.Screen
				name={routes.MAIN_STATISTICS_ROUTE}
				component={Statistics}
			/>
			<Tab.Screen
				name={routes.MAIN_SETTINGS_ROUTE}
				component={Settings}
			/>
		</Tab.Navigator>
	);
}
