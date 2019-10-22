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
        color: ThemeParser.theme.buttonTextColor,
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
    }
});

module.exports = {
    globalStyles: globalStyles
};