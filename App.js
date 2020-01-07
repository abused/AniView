import React from 'react';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {ImageBackground} from "react-native";
import * as TaskManager from 'expo-task-manager';
import {Notifications} from "expo";
import * as Permissions from 'expo-permissions';
import * as BackgroundFetch from 'expo-background-fetch';

const Info = require('./src/utils/Info');
const Utils = require('./src/utils/Utils');
const AppNavigation = require('./src/AppNavigation');
const AniListAuth = require('./src/utils/AniListAuth');
const NOTIFICATIONS_TASK = 'notification_updater';

BackgroundFetch.setMinimumIntervalAsync(60 * 15);
TaskManager.defineTask(NOTIFICATIONS_TASK, async ({data, error}) => {
    if (error) {
        console.error(error);
        return;
    }

    if (data) {
        const {status: existingStatus} = await Permissions.getAsync(
            Permissions.NOTIFICATIONS,
        );
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

        let token = await Utils.retrieveData('pushToken').then(async data => {
            return data ? data : await Notifications.getExpoPushTokenAsync();
        });
        let notificationsEnabled = await Utils.retrieveData('notifications').then(data => {return data});
        if(AniListAuth.loggedIn && notificationsEnabled) {
            AniListAuth.getUnreadNotifications().then(async data => {
                if (!data)
                    return;

                await AniListAuth.getUnreadNotifications().then(data => {
                    data.data.Page.notifications.forEach(notification => {
                        if (notification.unread) {
                            fetch('https://exp.host/--/api/v2/push/send', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    'accept-encoding': 'gzip, deflate',
                                    'host': 'exp.host'
                                },
                                body: JSON.stringify({
                                    to: token,
                                    title: 'Anime Update',
                                    body: 'Episode ' + notification.episode + 'of ' + notification.media.title.userPreferred + ' has been released!',
                                    priority: 'high',
                                    sound: 'default',
                                    channelId: 'default',
                                })
                            }).then(response => response.json()).then(data => {console.log(data)}).catch(err => console.error(err));
                        }
                    });
                }).catch(err => console.log(err));
            });
        }
    }
});

class LoadingScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this._loadAsync();
    }

    _loadAsync = async () => {
        AniListAuth.loadUserData();
        BackgroundFetch.registerTaskAsync(NOTIFICATIONS_TASK);
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