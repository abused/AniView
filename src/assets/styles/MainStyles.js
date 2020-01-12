import {StyleSheet} from "react-native";
import Constants from 'expo-constants';

const Info = require('../../utils/Info');
const theme = require('../../utils/ThemeParser');
const cardHeight = (Info.WINDOW_HEIGHT - (Constants.statusBarHeight * 5) - 30) / 3;
const cardWidth = (Info.WINDOW_WIDTH - 30) / 3;

const homeStyles = StyleSheet.create({
    animeCard: {
        margin: 5,
        width: cardWidth,
        height: cardHeight + (cardHeight / 3.5),
    },
    cardContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    animeImage: {
        width: cardWidth,
        height: cardHeight,
    },
    animeTitle: {
        marginTop: 5,
        flexWrap: 'wrap',
        textShadowColor: theme.textShadowColor,
        textShadowOffset: {width: -1, height: -1},
        textShadowRadius: 1,
        color: theme.textColor,
        marginLeft: 5
    },
    animeTitleCard: {
        width: cardWidth,
        height: cardHeight / 3.5,
        backgroundColor: theme.animeTitleBackgroundColor,
        borderTopColor: theme.textColor,
        borderTopWidth: 2
    }
});

const listStyles = StyleSheet.create({
    animeCard: {
        width: '95%',
        height: cardHeight,
        backgroundColor: 'transparent',
        marginBottom: 5,
        marginTop: 5,
        marginLeft: '2.5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    animeImage: {
        width: cardWidth,
        height: cardHeight,
        borderColor: theme.animeTitleBackgroundColor,
        borderWidth: 5
    },
    animeTitleCard: {
        backgroundColor: theme.animeTitleBackgroundColor,
        width: ((Info.WINDOW_WIDTH * 0.95) - cardWidth),
        height: '80%',
        paddingLeft: 10
    },
    animeTitle: {
        marginTop: 5,
        flexWrap: 'wrap',
        textShadowColor: theme.textShadowColor,
        textShadowOffset: {width: -1, height: -1},
        textShadowRadius: 1,
        color: theme.textColor,
        fontWeight: 'bold'
    },
    animeInfo: {
        flexWrap: 'wrap',
        color: theme.textColor,
        marginBottom: 5
    }
});

const searchStyles = StyleSheet.create({
    searchBar: {
        backgroundColor: theme.navBackgroundColor,
        borderTopColor: 'transparent',
        borderWidth: 0,
        borderBottomColor: theme.borderColor,
        borderBottomWidth: 3
    },
    animeCard: {
        width: '95%',
        height: cardHeight / 1.5,
        backgroundColor: 'transparent',
        marginBottom: 5,
        marginTop: 5,
        marginLeft: '2.5%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    animeImage: {
        width: cardWidth / 1.5,
        height: cardHeight / 1.5,
        borderColor: theme.animeTitleBackgroundColor,
        borderWidth: 5
    },
    animeTitleCard: {
        backgroundColor: theme.animeTitleBackgroundColor,
        width: ((Info.WINDOW_WIDTH * 0.95) - (cardWidth / 1.5)),
        height: '80%',
        paddingLeft: 10
    },
    animeTitle: {
        marginTop: 5,
        flexWrap: 'wrap',
        textShadowColor: theme.textShadowColor,
        textShadowOffset: {width: -1, height: -1},
        textShadowRadius: 1,
        color: theme.textColor,
        fontWeight: 'bold'
    },
    animeInfo: {
        flexWrap: 'wrap',
        color: theme.textColor
    }
});

const settingsStyles = StyleSheet.create({
    category: {
        borderBottomColor: theme.blueColor,
        borderBottomWidth: 2,
        marginTop: 20,
        paddingLeft: '2.5%'
    },
    specialText: {
        color: theme.textColor,
        fontWeight: 'lighter',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
    },
    nameText: {
        color: theme.textColor,
        fontSize: 28,
    },
    optionText: {
        color: theme.textColor,
        fontSize: 22,
        paddingLeft: '2.5%'
    },
    aboutText: {
        color: theme.textColor,
        fontSize: 20
    },
    profile: {
        borderBottomColor: theme.borderColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
        margin: 10,
        paddingBottom: 10
    },
    profilePic: {
        width: Info.WINDOW_WIDTH * 0.15,
        height: Info.WINDOW_WIDTH * 0.15,
        borderRadius: 10,
        marginRight: 10
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.animeTitleBackgroundColor,
        borderBottomColor: theme.textColor,
        height: 50,
        borderBottomWidth: 1
    },
    mainSection: {
        width: '100%',
    },
    closeButtonContainer: {
        width: '100%',
        marginBottom: 20
    },
    closeButton: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.redColor,
        position: 'absolute',
        top: 0,
        right: 0
    },
    themeView: {
        flexDirection: 'row',
    },
    themeOption: {
        width: '50%',
        alignItems: 'center',
    }
});

const animeScreenStyles = StyleSheet.create({
    animeContainer: {
        zIndex: 1,
        position: 'relative',
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        flexDirection: 'column'
    },
    contentContainer: {
        width: '95%',
        marginLeft: '2.5%',
        flexWrap: 'wrap'
    },
    closeButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginLeft: 10
    },
    closeButtonIcon: {
        textShadowColor: 'white',
        textShadowOffset: {width: -1, height: -1},
        textShadowRadius: 10,
    },
    closeButtonContainer: {
        zIndex: 1,
        position: 'absolute',
        width: '100%'
    },
    bannerImage: {
        width: '100%',
        height: Info.WINDOW_HEIGHT * 0.55,
        marginBottom: 5,
        borderBottomColor: theme.redColor,
        borderBottomWidth: 2
    },
    genreContainer: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 7
    },
    genre: {
        fontSize: 16,
        margin: 5,
        color: theme.textColor,
    },
    genreView: {
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10,
        borderRadius: 12,
        borderColor: theme.textColor,
        borderWidth: 0.5,
    },
    heading: {
        color: theme.redColor,
        fontWeight: 'bold',
        fontSize: 22
    },
    description: {
        marginTop: 5,
        color: theme.textColor,
        fontSize: 14
    },
    episodeCard: {
        width: '100%',
        height: 'auto',
        backgroundColor: theme.animeTitleBackgroundColor,
        marginBottom: 5,
        marginTop: 5,
    },
    animeImage: {
        width: cardWidth * 1.2,
        height: cardHeight / 2,
        borderColor: theme.animeTitleBackgroundColor,
        borderWidth: 5
    },
    animeEpisodeCard: {
        flex: 1,
        backgroundColor: theme.animeTitleBackgroundColor,
        width: Info.WINDOW_WIDTH - (cardWidth * 1.2),
        flexWrap: 'wrap',
        height: '80%',
        paddingLeft: 10
    },
    animeEpisodeTitle: {
        color: theme.textColor,
        fontSize: 13
    },
    animeEpisodeNumber: {
        color: theme.textColor,
        textShadowColor: theme.textShadowColor,
        textShadowOffset: {width: -1, height: -1},
        textShadowRadius: 1,
        fontWeight: 'bold',
        fontSize: 14,
        padding: 10
    },
    animeWebView: {
        width: '95%',
        height: 260,
        backgroundColor: 'transparent',
        marginBottom: 5,
        marginTop: 5,
        marginLeft: '2.5%',
        flexDirection: 'column',
        alignItems: 'center'
    },
    pageButton: {
        backgroundColor: theme.darkBlueColor,
        width: 'auto'
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        padding: 10,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: theme.blueColor,
        borderRadius: 4,
        color: theme.buttonTextColor,
        paddingRight: 30
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        padding: 10,
        borderWidth: 2,
        borderColor: theme.blueColor,
        borderRadius: 4,
        color: theme.buttonTextColor,
        paddingRight: 30
    }
});

module.exports = {
    homeStyles: homeStyles,
    listStyles: listStyles,
    searchStyles: searchStyles,
    settingsStyles: settingsStyles,
    animeScreenStyles: animeScreenStyles,
    pickerSelectStyles: pickerSelectStyles
};