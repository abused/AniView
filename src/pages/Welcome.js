import React from 'react';
import {ImageBackground, Image, View, TouchableOpacity} from 'react-native';
import {Text, Input} from 'react-native-elements/src/index';
import { Ionicons } from '@expo/vector-icons';

const styles = require('../assets/styles/WelcomeStyles');
const global = require('../assets/styles/GlobalStyles');
const AniListAuth = require('../utils/AniListAuth');
const Utils = require('../utils/Utils');
const Info = require('../utils/Info');
const ThemeParser = require('../utils/ThemeParser');

class WelcomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <ImageBackground source={Info.BACKGROUND} style={styles.welcomeStyles.background}>
                <View style={global.globalStyles.container}>
                    <Image
                        style={styles.welcomeStyles.logo}
                        source={Info.TRANS_LOGO}
                    />
                    <Text style={[styles.welcomeStyles.text, styles.welcomeStyles.appNameText]}>AniView</Text>
                    <Text style={[styles.welcomeStyles.text, styles.welcomeStyles.descText]}>All your anime, in one place!</Text>

                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={[global.globalStyles.halfButton, {backgroundColor: ThemeParser.themeData.theme.blueColor, borderRightColor: ThemeParser.themeData.theme.buttonRightBorderColor, borderRightWidth: 4}]} onPress={() => this.props.navigation.navigate('Login')}>
                                <Text style={global.globalStyles.buttonText}>AniList Sign In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[global.globalStyles.halfButton, {backgroundColor: ThemeParser.themeData.theme.redColor}]} onPress={() => {
                                Utils.storeData('showWelcome', 'false').then(value => {
                                   this.props.navigation.navigate('Main');
                                });
                            }}>
                                <Text style={global.globalStyles.buttonText}>Skip Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        token: ''
    };

    render() {
        return(
            <ImageBackground source={Info.BACKGROUND} style={styles.loginStyles.background}>
                <View style={global.globalStyles.container}>
                    <View style={styles.loginStyles.topView}>
                        <View style={{flexDirection: 'row', alignContent: 'space-between'}}>
                            <Image style={styles.loginStyles.logo} source={Info.WHITE_LOGO}/>
                        </View>
                        <Text style={styles.loginStyles.loginText}>AniList Login</Text>
                    </View>

                    <View style={styles.loginStyles.loginView}>
                        <Input
                            placeholder='Token'
                            placeholderTextColor={ThemeParser.themeData.theme.placeholderColor}
                            returnKeyType='done'
                            inputStyle={styles.loginStyles.token}
                            leftIcon={<Ionicons name='md-key' size={32} color={ThemeParser.themeData.theme.blueColor} />}
                            onChangeText={text => this.setState({token: text})}
                        />

                        <View style={{flex: 1, justifyContent: 'flex-end'}}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity style={[global.globalStyles.halfButton, {backgroundColor: ThemeParser.themeData.theme.blueColor, borderRightColor: ThemeParser.themeData.theme.buttonRightBorderColor, borderRightWidth: 4}]} onPress={() => AniListAuth.getALCode()}>
                                    <Text style={global.globalStyles.buttonText}>Get Code</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[global.globalStyles.halfButton, {backgroundColor: ThemeParser.themeData.theme.redColor}]} onPress={() => AniListAuth.login(this.state.token)}>
                                    <Text style={global.globalStyles.buttonText}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

module.exports = {
    WelcomeScreen: WelcomeScreen,
    LoginScreen: LoginScreen
};