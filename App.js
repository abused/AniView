import React from 'react';
import {createAppContainer, createSwitchNavigator, createBottomTabNavigator} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {ImageBackground} from "react-native";
import Welcome from './src/pages/Welcome';
import Main from './src/pages/Main';
const Utils = require('./src/utils/Utils');
const Info = require('./src/utils/Info');
const ThemeParser = require('./src/utils/ThemeParser');

/*
const MainStack = createStackNavigator(
    {
        AppHome: {screen: Welcome.LoginScreen}
    },
    {
        initialRouteName: 'AppHome'
    }
);
*/

const MainStack = createMaterialBottomTabNavigator(
    {
        Home: {
            screen: Main.HomeScreen,
            navigationOptions: {
                tabBarIcon: null
            }
        },
        List: {screen: Main.HomeScreen},
        Downloads: {screen: Main.HomeScreen},
        Search: {screen: Main.HomeScreen},
        Settings: {screen: Main.HomeScreen}
    },
    {
        initialRouteName: 'Home',
        activeColor: ThemeParser.themeData.theme.iconActiveColor,
        inactiveColor: ThemeParser.themeData.theme.iconColor,
        barStyle: {
            backgroundColor: ThemeParser.themeData.theme.navBackgroundColor
        },
        shifting: false
    }
);

const WelcomeStack = createStackNavigator(
    {
        AppWelcome: {screen: Welcome.WelcomeScreen},
        Login: {screen: Welcome.LoginScreen}
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
