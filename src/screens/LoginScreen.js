import React from 'react';
import {ImageBackground, Image, View, TouchableOpacity} from 'react-native';
import {Text, Input} from 'react-native-elements/src/index';
import {Ionicons} from '@expo/vector-icons';

const WelcomeStyles = require('../assets/styles/WelcomeStyles');
const GlobalStyles = require('../assets/styles/GlobalStyles');
const AniListAuth = require('../utils/AniListAuth');
const Info = require('../utils/Info');
const ThemeParser = require('../utils/ThemeParser');
const Utils = require('../utils/Utils');

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    state = {
        token: ''
    };

    render() {
        return(
            <ImageBackground source={Info.BACKGROUND} style={WelcomeStyles.loginStyles.background}>
                <View style={GlobalStyles.globalStyles.container}>
                    <View style={WelcomeStyles.loginStyles.topView}>
                        <View style={{flexDirection: 'row', alignContent: 'space-between'}}>
                            <Image style={WelcomeStyles.loginStyles.logo} source={Info.WHITE_LOGO}/>
                        </View>
                        <Text style={WelcomeStyles.loginStyles.loginText}>AniList Login</Text>
                    </View>

                    <View style={WelcomeStyles.loginStyles.loginView}>
                        <Input
                            placeholder='Token'
                            placeholderTextColor={ThemeParser.placeholderColor}
                            returnKeyType='done'
                            inputStyle={WelcomeStyles.loginStyles.token}
                            leftIcon={<Ionicons name='md-key' size={32} color={ThemeParser.blueColor} />}
                            onChangeText={text => this.setState({token: text})}
                        />

                        <View style={{flex: 1, justifyContent: 'flex-end'}}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity style={[GlobalStyles.globalStyles.halfButton, {backgroundColor: ThemeParser.blueColor, borderRightColor: ThemeParser.buttonRightBorderColor, borderRightWidth: 4}]} onPress={() => AniListAuth.getALCode()}>
                                    <Text style={GlobalStyles.globalStyles.buttonText}>Get Code</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[GlobalStyles.globalStyles.halfButton, {backgroundColor: ThemeParser.redColor}]} onPress={() => {
                                    AniListAuth.login(this.state.token).then(value => {
                                        if(AniListAuth.loggedIn) {
                                            Utils.storeData('showWelcome', 'false').then(value => {
                                                this.props.navigation.navigate('Main');
                                            });
                                        }
                                    });
                                }}>
                                    <Text style={GlobalStyles.globalStyles.buttonText}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}