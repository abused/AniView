import {StyleSheet} from "react-native";
const Info = require('../../utils/Info');
const ThemeParser = require('../../utils/ThemeParser');
import Constants from 'expo-constants';

const homeStyles = StyleSheet.create({
    animeCard: {
        margin: 5,
        width: (Info.WINDOW_WIDTH - 30) / 3,
        height: (Info.WINDOW_HEIGHT - (Constants.statusBarHeight * 4) - 30) / 3,
        borderRadius: '2%',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 1
    },
    cardContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    animeTitleBackground: {
        borderBottomLeftRadius: '2%',
        borderBottomRightRadius: '2%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    animeTitle: {
        flexWrap: 'wrap',
        marginBottom: 10,
        textShadowColor: 'black',
        textShadowOffset: {width: -1, height: -1},
        textShadowRadius: 10,
        color: 'white'
    }
});

module.exports = {
    homeStyles: homeStyles
};