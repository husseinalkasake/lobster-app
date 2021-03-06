import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../views/main/Home';
import Statistics from '../views/main/Statistics';
import PersonalProfile from '../views/main/PersonalProfile';
import {
	MAIN_HOME_ROUTE,
	MAIN_STATISTICS_ROUTE,
	MAIN_PERSONAL_PROFILE_ROUTE,
} from './routes';

export default function MainTabs() {
	const Tab = createBottomTabNavigator();

	return (
		<Tab.Navigator
			initialRouteName={MAIN_HOME_ROUTE}
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					switch (route.name) {
            			case MAIN_STATISTICS_ROUTE:
              				iconName = focused ? "equalizer" : "equalizer-outline";
              				break;
            			case MAIN_PERSONAL_PROFILE_ROUTE:
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
				name={MAIN_HOME_ROUTE}
				component={Home}
			/>
			<Tab.Screen
				name={MAIN_STATISTICS_ROUTE}
				component={Statistics}
			/>
			<Tab.Screen
				name={MAIN_PERSONAL_PROFILE_ROUTE}
				component={PersonalProfile}
			/>
		</Tab.Navigator>
	);
}
