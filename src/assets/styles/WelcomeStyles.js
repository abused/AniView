import {StyleSheet} from "react-native";

const Info = require('../../utils/Info');
const theme = require('../../utils/ThemeParser');

const welcomeStyles = StyleSheet.create({
    background: {
        flex: 1,
        width: Info.WINDOW_WIDTH,
        height: Info.WINDOW_HEIGHT
    },
    logo: {
        width: '50%',
        height: '50%',
        alignSelf: 'center'
    },
    text: {
        color: theme.buttonTextColor,
        alignSelf: 'center',
        fontFamily: 'Arial',
    },
    appNameText: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: -60
    },
    descText: {
        fontSize: 22
    }
});

const loginStyles = StyleSheet.create({
    background: {
        top: 0,
        flex: 1,
        width: Info.WINDOW_WIDTH,
        height: Info.WINDOW_HEIGHT * 0.4
    },
    topView: {
        width: Info.WINDOW_WIDTH,
        height: Info.WINDOW_HEIGHT * 0.4,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginView: {
        width: Info.WINDOW_WIDTH,
        height: Info.WINDOW_HEIGHT * 0.6,
        backgroundColor: theme.backgroundColor,
        borderTopColor: theme.borderColor,
        borderTopWidth: 4,
        paddingTop: 25
    },
    logo: {
        width: Info.WINDOW_WIDTH * 0.3,
        height: Info.WINDOW_WIDTH * 0.3,
        borderRadius: (Info.WINDOW_WIDTH * 0.3) / 2
    },
    loginText: {
        color: theme.buttonTextColor,
        fontSize: 28,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 0,
        textShadowColor: 'black',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    token: {
        width: Info.WINDOW_WIDTH / 4,
        color: theme.textColor,
        fontWeight: 'bold',
        paddingLeft: 5
    }
});

module.exports = {
    welcomeStyles,
    loginStyles
};