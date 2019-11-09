import React from 'react';
import {Text} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MyAnimeListScreen from './screens/MyAnimeListScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';
const ThemeParser = require('./utils/ThemeParser');
const GlobalStyles = require('./assets/styles/GlobalStyles');

const HomeStack = createStackNavigator({Home: {screen: HomeScreen}}, {initialRouteName: 'Home'});
const ListStack = createStackNavigator({List: {screen: MyAnimeListScreen}}, {initialRouteName: 'List'});
const SearchStack = createStackNavigator({Search: {screen: SearchScreen}}, {initialRouteName: 'Search'});
const SettingsStack = createStackNavigator({Settings: {screen: SettingsScreen}}, {initialRouteName: 'Settings'});
const MainStack = createMaterialBottomTabNavigator(
    {
        Home: {
            screen: HomeStack,
            navigationOptions: {
                tabBarLabel: <Text style={{fontSize: 14}}>Home</Text>,
                tabBarIcon: ({tintColor}) => (<FontAwesome color={tintColor} size={24} name='home' />)
            }
        },
        List: {
            screen: ListStack,
            navigationOptions: {
                tabBarLabel: <Text style={{fontSize: 14}}>List</Text>,
                tabBarIcon: ({tintColor}) => (<FontAwesome color={tintColor} size={24} name='list' />)
            }
        },
        Search: {
            screen: SearchStack,
            navigationOptions: {
                tabBarLabel: <Text style={{fontSize: 14}}>Search</Text>,
                tabBarIcon: ({tintColor}) => (<FontAwesome color={tintColor} size={24} name='search' />)
            }
        },
        Settings: {
            screen: SettingsStack,
            navigationOptions: {
                tabBarLabel: <Text style={{fontSize: 14}}>Settings</Text>,
                tabBarIcon: ({tintColor}) => (<FontAwesome color={tintColor} size={24} name='gear' />)
            }
        }
    },
    {
        initialRouteName: 'Home',
        activeColor: ThemeParser.navActiveColor,
        inactiveColor: ThemeParser.navInactiveColor,
        barStyle: GlobalStyles.globalStyles.navigation,
        shifting: true
    }
);

const WelcomeStack = createStackNavigator(
    {
        AppWelcome: {screen: WelcomeScreen},
        Login: {screen: LoginScreen}
    },
    {
        initialRouteName: 'AppWelcome'
    }
);

module.exports = {
    MainStack: MainStack,
    WelcomeStack: WelcomeStack,
};