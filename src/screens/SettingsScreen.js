import React from 'react';
import {SafeAreaView, View, TouchableOpacity, Text, Image, Linking, Switch, ScrollView} from "react-native";
import {NavigationEvents} from "react-navigation";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Modal from 'react-native-modalbox';

const ThemeParser = require('./../utils/ThemeParser');
const GlobalStyles = require('./../assets/styles/GlobalStyles');
const MainStyles = require('./../assets/styles/MainStyles');
const AniListAuth = require('./../utils/AniListAuth');
const Info = require('./../utils/Info');
const Utils = require('./../utils/Utils');

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: <Text style={GlobalStyles.globalStyles.headerText}>Settings</Text>,
        headerStyle: GlobalStyles.globalStyles.header
    };

    state = {
        refreshing: false,
        aboutVisible: false,
        displayThemes: false,
        notifications: true
    };

    constructor(props) {
        super(props);
        this._loadAsync();
    }

    _loadAsync = () => {
        Utils.retrieveData('notifications').then(value => {
            this.setState({notifications: value !== 'false'});
        });
    };

    setRefreshing = (value) => {
        this.setState({refreshing: value});
    };

    setNotifications = () => {
        let {notifications} = this.state;
        Utils.storeData('notifications', (!notifications).toString()).then(() => this.setState({notifications: !notifications}));
    };

    render() {
        let {aboutVisible, displayThemes, notifications} = this.state;

        return(
            <SafeAreaView style={[GlobalStyles.globalStyles.safeContainer, {backgroundColor: ThemeParser.backgroundColor}]}>
                <NavigationEvents onDidFocus={() => this.setRefreshing(false)} />

                <Modal
                    style={{backgroundColor: ThemeParser.backgroundColor, height: '85%', paddingLeft: '2%', paddingRight: '2%'}}
                    position={'bottom'}
                    swipeArea={Info.WINDOW_HEIGHT * 0.5}
                    isOpen={aboutVisible}
                    onClosed={() => this.setState({aboutVisible: false})}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={MainStyles.settingsStyles.aboutText}>{Info.ABOUT}</Text>
                    </ScrollView>
                </Modal>

                <View style={MainStyles.settingsStyles.profile}>
                    <Image style={MainStyles.settingsStyles.profilePic} source={AniListAuth.loggedIn ? {uri: AniListAuth.userAvatar} : Info.WHITE_LOGO} />
                    <Text style={MainStyles.settingsStyles.nameText}>{AniListAuth.loggedIn ? AniListAuth.userName : 'Not Logged In!'}</Text>
                </View>

                <View style={MainStyles.settingsStyles.mainSection}>
                    <View style={MainStyles.settingsStyles.category}>
                        <Text style={MainStyles.settingsStyles.specialText}>GENERAL</Text>
                    </View>


                    <View style={MainStyles.settingsStyles.option} onPress={() => this.setState({displayThemes: !displayThemes})}>
                        <Text style={MainStyles.settingsStyles.optionText}><FontAwesome5Icon name={'bell'} size={20}/>   Notifications</Text>
                        <Switch style={{position: 'absolute', right: '2.5%'}} onValueChange={this.setNotifications} value={notifications} onTintColor={ThemeParser.blueColor} tintColor={ThemeParser.textColor}/>
                    </View>

                    <View style={MainStyles.settingsStyles.category}>
                        <Text style={MainStyles.settingsStyles.specialText}>SUPPORT</Text>
                    </View>

                    <TouchableOpacity style={MainStyles.settingsStyles.option} onPress={() => Linking.openURL(Info.DISCORD_LINK)}>
                        <Text style={MainStyles.settingsStyles.optionText}><FontAwesome5Icon name={'discord'} size={20}/>   Discord</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={MainStyles.settingsStyles.option} onPress={() => Linking.openURL(Info.ISSUES_LINK)}>
                        <Text style={MainStyles.settingsStyles.optionText}><FontAwesome5Icon name={'exclamation-circle'} size={20}/>   Issues</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={MainStyles.settingsStyles.option} onPress={() => this.setState({aboutVisible: true})}>
                        <Text style={MainStyles.settingsStyles.optionText}><FontAwesome5Icon name={'info-circle'} size={20}/>   About</Text>
                    </TouchableOpacity>

                    {
                        AniListAuth.loggedIn ?
                            <View style={MainStyles.settingsStyles.category}>
                                <Text style={MainStyles.settingsStyles.specialText}>ACCOUNT</Text>
                            </View> : null
                    }
                    {
                        AniListAuth.loggedIn ?
                            <TouchableOpacity style={MainStyles.settingsStyles.option} onPress={() => AniListAuth.logout().then(value => this.setRefreshing(false))}>
                                <Text style={[MainStyles.settingsStyles.optionText, {color: ThemeParser.redColor}]}><FontAwesome5Icon name={'sign-out-alt'} size={20}/>   Logout </Text>
                            </TouchableOpacity> : null
                    }
                </View>
            </SafeAreaView>
        );
    }
}