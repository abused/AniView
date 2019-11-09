import React from 'react';
import {SafeAreaView, View, TouchableOpacity, Text, Image, Linking, Switch} from "react-native";
import {BottomModal, ModalContent} from 'react-native-modals'
import {NavigationEvents} from "react-navigation";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

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
        Utils.storeData('notifications', (!this.state.notifications).toString()).then(() => this.setState({notifications: !this.state.notifications}));
    };

    render() {
        return(
            <SafeAreaView style={[GlobalStyles.globalStyles.safeContainer, {backgroundColor: ThemeParser.backgroundColor}]}>
                <NavigationEvents onDidFocus={() => this.setRefreshing(false)} />

                <BottomModal swipeDirection={'down'} height={0.8} visible={this.state.aboutVisible} onTouchOutside={() => this.setState({aboutVisible: false})} modalStyle={{backgroundColor: ThemeParser.backgroundColor}}>
                    <ModalContent>
                        <View style={MainStyles.settingsStyles.closeButtonContainer}>
                            <TouchableOpacity onPress={() => this.setState({aboutVisible: false})}>
                                <Text style={MainStyles.settingsStyles.closeButton}><FontAwesome5Icon name={'times'} size={32}/></Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={MainStyles.settingsStyles.aboutText}>{Info.ABOUT}</Text>
                    </ModalContent>
                </BottomModal>

                <View style={MainStyles.settingsStyles.profile}>
                    <Image style={MainStyles.settingsStyles.profilePic} source={AniListAuth.loggedIn ? {uri: AniListAuth.userAvatar} : Info.WHITE_LOGO} />
                    <Text style={MainStyles.settingsStyles.nameText}>{AniListAuth.loggedIn ? AniListAuth.userName : 'Not Logged In!'}</Text>
                </View>

                <View style={MainStyles.settingsStyles.mainSection}>
                    <View style={MainStyles.settingsStyles.category}>
                        <Text style={MainStyles.settingsStyles.specialText}>GENERAL</Text>
                    </View>


                    <View style={MainStyles.settingsStyles.option} onPress={() => this.setState({displayThemes: !this.state.displayThemes})}>
                        <Text style={MainStyles.settingsStyles.optionText}><FontAwesome5Icon name={'bell'} size={20}/>   Notifications</Text>
                        <Switch style={{position: 'absolute', right: '2.5%'}} onValueChange={this.setNotifications} value={this.state.notifications} onTintColor={ThemeParser.blueColor} tintColor={ThemeParser.textColor}/>
                    </View>

                    <View style={MainStyles.settingsStyles.category}>
                        <Text style={MainStyles.settingsStyles.specialText}>SUPPORT</Text>
                    </View>

                    <TouchableOpacity style={MainStyles.settingsStyles.option} onPress={() => Linking.openURL(Info.DISCORD_LINK)}>
                        <Text style={MainStyles.settingsStyles.optionText}><FontAwesome5Icon name={'discord'} size={20}/>   Discord</Text>
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

/*
                    <TouchableOpacity style={MainStyles.settingsStyles.option} onPress={() => this.setState({displayThemes: !this.state.displayThemes})}>
                        <Text style={MainStyles.settingsStyles.optionText}><FontAwesome5Icon name={'palette'} size={20}/>   Theme</Text>
                    </TouchableOpacity>

                    <Collapsible collapsed={!this.state.displayThemes}>
                        <View style={MainStyles.settingsStyles.themeView}>
                            <TouchableOpacity style={[MainStyles.settingsStyles.themeOption, {backgroundColor: ThemeParser.themes.DARK.navBackgroundColor}]} onPress={() => {
                                ThemeParser.loadTheme(ThemeParser.themes.DARK);
                                clearThemeCache();
                                this.setRefreshing(false);
                            }}>
                                <Text style={[MainStyles.settingsStyles.specialText, {color: ThemeParser.themes.DARK.textColor}]}>Dark</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[MainStyles.settingsStyles.themeOption, {backgroundColor: ThemeParser.themes.LIGHT.animeTitleBackgroundColor}]} onPress={() => {
                                ThemeParser.loadTheme(ThemeParser.themes.LIGHT);
                                clearThemeCache();
                                this.setRefreshing(false);
                            }}>
                                <Text style={[MainStyles.settingsStyles.specialText, {color: ThemeParser.themes.LIGHT.textColor}]}>Light</Text>
                            </TouchableOpacity>
                        </View>
                    </Collapsible>
                     */