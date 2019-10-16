import React from 'react';
import {StyleSheet, ImageBackground, Image, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
const Info = require('./Info');
const Actions = require('./Actions');

export default class Welcome extends React.Component {
    render() {
        return (
            <ImageBackground source={require('./assets/images/background.jpg')} style={styles.background}>
                <View style={styles.container}>
                    <Image
                        style={styles.logo}
                        source={require('./assets/images/transparent_logo.png')}
                    />
                    <Text style={[styles.text, styles.appNameText]}>AniView</Text>
                    <Text style={[styles.text, styles.descText]}>All your anime, in one place!</Text>

                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity style={[styles.button, {backgroundColor: '#05b7ed', borderRightColor: 'black', borderRightWidth: 4}]} onPress={() => this.props.updateWelcome(true, true)}>
                                <Text style={styles.buttonText}>AniList Sign In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, {backgroundColor: '#FF5757'}]} onPress={() => this.props.updateWelcome(false, false)}>
                                <Text style={styles.buttonText}>Skip Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: Info.WINDOW_WIDTH,
        height: Info.WINDOW_HEIGHT
    },
    background: {
        flex: 1,
        width: Info.WINDOW_WIDTH,
        height: Info.WINDOW_HEIGHT
    },
    logo: {
        width: '50%',
        height: '50%',
        alignSelf: "center"
    },
    text: {
        color: 'white',
        alignSelf: "center",
        fontFamily: 'Arial',
    },
    appNameText: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: -60
    },
    descText: {
        fontSize: 22
    },
    buttonText: {
        color:'white',
        fontWeight: 'bold',
        fontSize: 20
    },
    button: {
        width: Info.WINDOW_WIDTH / 2,
        height: 0.12 * Info.WINDOW_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    }
});