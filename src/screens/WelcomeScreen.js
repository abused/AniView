import React from 'react';
import {ImageBackground, Image, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';

const WelcomeStyles = require('../assets/styles/WelcomeStyles');
const GlobalStyles = require('../assets/styles/GlobalStyles');
const Utils = require('../utils/Utils');
const Info = require('../utils/Info');
const ThemeParser = require('../utils/ThemeParser');

export default class WelcomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <ImageBackground source={Info.BACKGROUND} style={WelcomeStyles.welcomeStyles.background}>
                <View style={GlobalStyles.globalStyles.container}>
                    <Image
                        style={WelcomeStyles.welcomeStyles.logo}
                        source={Info.TRANS_LOGO}
                    />
                    <Text style={[WelcomeStyles.welcomeStyles.text, WelcomeStyles.welcomeStyles.appNameText]}>AniView</Text>
                    <Text style={[WelcomeStyles.welcomeStyles.text, WelcomeStyles.welcomeStyles.descText]}>All your anime, in one place!</Text>

                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={[GlobalStyles.globalStyles.halfButton, {backgroundColor: ThemeParser.blueColor, borderRightColor: ThemeParser.buttonRightBorderColor, borderRightWidth: 4}]} onPress={() => this.props.navigation.navigate('Login')}>
                                <Text style={GlobalStyles.globalStyles.buttonText}>AniList Sign In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[GlobalStyles.globalStyles.halfButton, {backgroundColor: ThemeParser.redColor}]} onPress={() => {
                                Utils.storeData('showWelcome', 'false').then(value => {
                                    this.props.navigation.navigate('Main');
                                });
                            }}>
                                <Text style={GlobalStyles.globalStyles.buttonText}>Skip Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}