import React from 'react';
import {FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity} from "react-native";
import {SearchBar} from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import BaseAnimeScreen from './BaseAnimeScreen';

const ThemeParser = require('./../utils/ThemeParser');
const GlobalStyles = require('./../assets/styles/GlobalStyles');
const MainStyles = require('./../assets/styles/MainStyles');

export default class SearchScreen extends BaseAnimeScreen {
    static navigationOptions = ({navigation}) => ({
        title: <Text style={GlobalStyles.globalStyles.headerText}>{navigation.getParam('title') ? navigation.getParam('title') : 'Search'}</Text>,
        headerStyle: GlobalStyles.globalStyles.noBorderHeader,
        headerLeft: () => ( navigation.getParam('showBack') ?
                <TouchableOpacity style={MainStyles.animeScreenStyles.closeButton} onPress={navigation.getParam('hideAnimePage')}>
                    <Text><FontAwesome5Icon style={MainStyles.settingsStyles.closeButtonIcon} color={ThemeParser.redColor} name={'arrow-left'} size={28}/></Text>
                </TouchableOpacity> : null
        )
    });

    render() {
        return(
            <SafeAreaView style={[GlobalStyles.globalStyles.safeContainer, {backgroundColor: ThemeParser.backgroundColor}]}>
                {this.AnimePageModal()}
                <SearchBar placeholder='Search' returnKeyType='done' onChangeText={this.updateSearch} value={this.state.search} containerStyle={MainStyles.searchStyles.searchBar}/>

                <FlatList
                    style={{flex: 1}}
                    data={this.state.results}
                    numColumns={1}
                    renderItem={({item}) => this.SearchItem(
                        item.id,
                        item.title.english !== null ? item.title.english : item.title.romaji,
                        item.coverImage.large,
                        item.description
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={<RefreshControl title='Pull to refresh' titleColor={ThemeParser.textColor}
                                                    tintColor={ThemeParser.textColor}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}/>}
                />
            </SafeAreaView>
        );
    }
}