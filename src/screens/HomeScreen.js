import React from 'react';
import {TouchableOpacity, SafeAreaView, RefreshControl, View, Text, FlatList, ImageBackground} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BaseScreen from './BaseScreen';

const MainStyles = require('../assets/styles/MainStyles');
const GlobalStyles = require('../assets/styles/GlobalStyles');
const Utils = require('../utils/Utils');
const Info = require('../utils/Info');
const ThemeParser = require('../utils/ThemeParser');
const AniListAuth = require('../utils/AniListAuth');

function Item({id, title, image}) {
    return(
        <ImageBackground source={{uri: image}} style={MainStyles.homeStyles.animeCard} imageStyle={{borderRadius: '2%'}}>
            <TouchableOpacity style={MainStyles.homeStyles.cardContent} onPress={() => console.log(title)}>
                <View style={MainStyles.homeStyles.animeTitleBackground}>
                    <Text style={MainStyles.homeStyles.animeTitle}>{title}</Text>
                </View>
            </TouchableOpacity>
        </ImageBackground>
    );
}

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

export default class HomeScreen extends BaseScreen {
    static navigationOptions = {
        title: <Text style={GlobalStyles.globalStyles.headerText}>Popular Anime</Text>,
        headerStyle: GlobalStyles.globalStyles.header
    };

    state = {
        refreshing: false
    };

    setRefreshing = (value) => {
        this.setState({refreshing: value});
    };

    onRefresh = () => {
        this.setRefreshing(true);
        AniListAuth.getMostPopularAnime();
        wait(1000).then(() => this.setRefreshing(false));
    };

    render() {
        if(this.state.isConnected) {
            return(
                <SafeAreaView style={[GlobalStyles.globalStyles.safeContainer, {backgroundColor: ThemeParser.themeData.theme.backgroundColor}]}>
                    <FlatList
                        data={AniListAuth.trendingAnime}
                        numColumns={3}
                        renderItem={({item}) => (<Item id={item.id} title={item.title.english} image={item.coverImage.large} keyExtractor={item => item.id} />)}
                        refreshControl={<RefreshControl title='Pull to refresh' titleColor='white' tintColor='white' refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>}
                    />
                </SafeAreaView>
            );
        }else {
            return(
                <SafeAreaView style={[GlobalStyles.globalStyles.safeContainer, {backgroundColor: ThemeParser.themeData.theme.backgroundColor, justifyContent: 'center', alignItems: 'center'}]}>
                    <FontAwesome color='white' size={40} name='wifi' />
                    <Text style={{color: ThemeParser.themeData.theme.textColor, fontSize: 30}}>No Internet Connection</Text>
                </SafeAreaView>
            );
        }
    }
}