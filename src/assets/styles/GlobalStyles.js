import {StyleSheet} from "react-native";

const Info = require('../../utils/Info');
const ThemeParser = require('../../utils/ThemeParser');

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: Info.WINDOW_WIDTH,
        height: Info.WINDOW_HEIGHT
    },
    buttonText: {
        color: ThemeParser.themeData.theme.buttonTextColor,
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
    navigation: {
        backgroundColor: ThemeParser.themeData.theme.navBackgroundColor,
        borderTopColor: ThemeParser.themeData.theme.borderColor,
        borderTopWidth: 3
    },
    header: {
        color: ThemeParser.themeData.theme.textColor,
        backgroundColor: ThemeParser.themeData.theme.navBackgroundColor,
        borderBottomColor: ThemeParser.themeData.theme.borderColor,
        borderBottomWidth: 3
    },
    headerText: {
        color: ThemeParser.themeData.theme.textColor,
        fontFamily: 'Roboto',
        fontSize: 22
    },
    safeContainer: {
        flex: 1
    }
});

module.exports = {
    globalStyles: globalStyles
};