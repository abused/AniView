import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {ImageBackground, Text} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Utils = require('./src/utils/Utils');
const Info = require('./src/utils/Info');
const ThemeParser = require('./src/utils/ThemeParser');
const GlobalStyles = require('./src/assets/styles/GlobalStyles');

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

const HomeStack = createStackNavigator({Home: {screen: HomeScreen}}, {initialRouteName: 'Home'});
const ListStack = createStackNavigator({List: {screen: HomeScreen}}, {initialRouteName: 'List'});
const DownloadsStack = createStackNavigator({Downloads: {screen: HomeScreen}}, {initialRouteName: 'Downloads'});
const SearchStack = createStackNavigator({Search: {screen: HomeScreen}}, {initialRouteName: 'Search'});
const SettingsStack = createStackNavigator({Settings: {screen: HomeScreen}}, {initialRouteName: 'Settings'});
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
        Downloads: {
            screen: DownloadsStack,
            navigationOptions: {
                tabBarLabel: <Text style={{fontSize: 14}}>D/L</Text>,
                tabBarIcon: ({tintColor}) => (<FontAwesome color={tintColor} size={24} name='download' />)
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
        activeColor: ThemeParser.themeData.theme.navActiveColor,
        inactiveColor: ThemeParser.themeData.theme.navInactiveColor,
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

class LoadingScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this._loadAsync();
    }

    _loadAsync = async () => {
        //For testing when needed, delete later
        //Utils.deleteData('showWelcome');

        Utils.retrieveData('theme').then(value => {
           if(value !== null) {
               ThemeParser.theme.loadTheme(ThemeParser.themes[value]);
           }else {
               ThemeParser.theme.loadTheme(ThemeParser.themes['DEFAULT']);
           }
        });
        Utils.retrieveData('showWelcome').then(value => {
            if(value === 'false') {
                this.props.navigation.navigate('Main');
            }else {
                this.props.navigation.navigate('Welcome');
            }
        });
    };

    render() {
        return(
            <ImageBackground source={Info.SPLASH} style={{flex: 1, width: Info.WINDOW_WIDTH, height: Info.WINDOW_HEIGHT}} />
        );
    }
}

export default createAppContainer(createSwitchNavigator(
    {
        Loading: LoadingScreen,
        Main: MainStack,
        Welcome: WelcomeStack
    },
    {
        initialRouteName: 'Loading'
    }
));
