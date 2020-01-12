import React from 'react';
import {
    TouchableOpacity,
    SafeAreaView,
    RefreshControl,
    Text,
    FlatList,
    ActivityIndicator,
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import BaseAnimeScreen from './BaseAnimeScreen';

const MainStyles = require('../assets/styles/MainStyles');
const GlobalStyles = require('../assets/styles/GlobalStyles');
const ThemeParser = require('../utils/ThemeParser');
const AniListAuth = require('../utils/AniListAuth');

export default class HomeScreen extends BaseAnimeScreen {
    static navigationOptions = ({navigation}) => ({
        title: <Text style={GlobalStyles.globalStyles.headerText}>{navigation.getParam('title') ? navigation.getParam('title') : 'Popular Anime'}</Text>,
        headerStyle: GlobalStyles.globalStyles.header,
        headerLeft: () => (navigation.getParam('showBack') ?
            <TouchableOpacity style={MainStyles.animeScreenStyles.closeButton} onPress={navigation.getParam('hideAnimePage')}>
                <Text><FontAwesome5Icon style={MainStyles.settingsStyles.closeButtonIcon} color={ThemeParser.redColor} name={'arrow-left'} size={28}/></Text>
            </TouchableOpacity> : null)
    });

    constructor(props) {
        super(props);
    }

    render() {
        let {animeLoaded, animeScreenOpen, refreshing} = this.state;

        if(animeLoaded) {
            return(
                <SafeAreaView style={[GlobalStyles.globalStyles.safeContainer, {backgroundColor: ThemeParser.backgroundColor}]}>
                    {animeScreenOpen ? this.AnimePageModal() : null}

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{flex: 1}}
                        data={AniListAuth.trendingAnime}
                        numColumns={3}
                        renderItem={({item}) => this.HomeItem(item.id, item.title.english !== null ? item.title.english : item.title.romaji, item.coverImage.large)}
                        keyExtractor={(item) => item.id.toString()}
                        refreshControl={<RefreshControl title='Pull to refresh' titleColor={ThemeParser.textColor} tintColor={ThemeParser.textColor} refreshing={refreshing} onRefresh={this.onRefresh}/>}
                    />
                </SafeAreaView>
            );
        }else {
            return (
                <SafeAreaView style={[GlobalStyles.globalStyles.safeContainer, {backgroundColor: ThemeParser.backgroundColor, justifyContent: 'center', alignItems: 'center'}]}>
                    <ActivityIndicator size='large' color={ThemeParser.textColor} />
                </SafeAreaView>
            );
        }
    }
}