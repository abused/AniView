import React from 'react';
import {SafeAreaView, View, TouchableOpacity, Text, Image, Linking, ScrollView, FlatList} from "react-native";
import {BottomModal, ModalContent} from 'react-native-modals'
import {NavigationEvents} from "react-navigation";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const ThemeParser = require('./../utils/ThemeParser');
const GlobalStyles = require('./../assets/styles/GlobalStyles');
const MainStyles = require('./../assets/styles/MainStyles');
const AniListAuth = require('./../utils/AniListAuth');
const Info = require('./../utils/Info');

export default class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: <Text style={GlobalStyles.globalStyles.headerText}>Settings</Text>,
        headerStyle: GlobalStyles.globalStyles.header
    };

    state = {
        refreshing: false,
        aboutVisible: false
    };

    setRefreshing = (value) => {
        this.setState({refreshing: value});
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

                <View style={MainStyles.settingsStyles.headerView}>
                    <Text style={[MainStyles.settingsStyles.specialText]}>Support</Text>
                </View>

                <View style={MainStyles.settingsStyles.options}>

                    <TouchableOpacity style={MainStyles.settingsStyles.option} onPress={() => Linking.openURL(Info.DISCORD_LINK)}>
                        <Text style={MainStyles.settingsStyles.categoryText}><FontAwesome5Icon name={'discord'} size={20}/> Discord</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={MainStyles.settingsStyles.option} onPress={() => this.setState({aboutVisible: true})}>
                        <Text style={MainStyles.settingsStyles.categoryText}><FontAwesome5Icon name={'info-circle'} size={20}/> About</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={MainStyles.settingsStyles.option}>
                        <Text style={MainStyles.settingsStyles.categoryText}><FontAwesome5Icon name={'palette'} size={20}/> Themes (Coming Soon!)</Text>
                    </TouchableOpacity>

                    {
                        AniListAuth.loggedIn ?
                        <TouchableOpacity style={MainStyles.settingsStyles.option} onPress={() => {
                            AniListAuth.logout().then(value => this.setRefreshing(false));
                        }}>
                            <Text style={MainStyles.settingsStyles.categoryText}><FontAwesome5Icon name={'sign-out-alt'} size={20}/> Logout </Text>
                        </TouchableOpacity> : null
                    }
                </View>
            </SafeAreaView>
        );
    }
}