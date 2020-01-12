import {StyleSheet} from "react-native";

const Info = require('../../utils/Info');
const theme = require('../../utils/ThemeParser');

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: Info.WINDOW_WIDTH,
        height: Info.WINDOW_HEIGHT
    },
    buttonText: {
        color: theme.buttonTextColor,
        fontWeight: 'bold',
        fontSize: 20
    },
    halfButton: {
        width: Info.WINDOW_WIDTH / 2,
        height: 0.12 * Info.WINDOW_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fullButton: {
        width: Info.WINDOW_WIDTH,
        height: 0.12 * Info.WINDOW_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ovalButton: {
        width: Info.WINDOW_WIDTH * 0.7,
        height: 0.06 * Info.WINDOW_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    navigation: {
        backgroundColor: theme.navBackgroundColor,
        borderTopColor: theme.borderColor,
        borderTopWidth: 3
    },
    header: {
        color: theme.textColor,
        backgroundColor: theme.navBackgroundColor,
        borderBottomColor: theme.borderColor,
        borderBottomWidth: 3
    },
    noBorderHeader: {
        color: theme.textColor,
        backgroundColor: theme.navBackgroundColor,
        borderBottomWidth: 0
    },
    headerText: {
        color: theme.textColor,
        fontFamily: 'Roboto',
        fontSize: 22
    },
    safeContainer: {
        flex: 1
    }
});

module.exports = {globalStyles};