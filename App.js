import React from 'react';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {ImageBackground} from "react-native";
const Info = require('./src/utils/Info');
const Utils = require('./src/utils/Utils');
const AppNavigation = require('./src/AppNavigation');
const AniListAuth = require('./src/utils/AniListAuth');

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

        AniListAuth.loadUserData();
        Utils.retrieveData('showWelcome').then(value => {
            this.props.navigation.navigate(value === 'false' ? 'Main' : 'Welcome');
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
        Main: AppNavigation.MainStack,
        Welcome: AppNavigation.WelcomeStack
    },
    {
        initialRouteName: 'Loading'
    }
));