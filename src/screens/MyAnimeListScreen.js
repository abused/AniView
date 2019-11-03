import React from 'react';
import {
    TouchableOpacity,
    RefreshControl,
    View,
    Text,
    FlatList,
    ImageBackground,
    ActivityIndicator,
    Image,
} from "react-native";
import {SafeAreaView, NavigationEvents} from 'react-navigation';
import {Input} from "react-native-elements";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import BaseAnimeScreen from './BaseAnimeScreen';

const MainStyles = require('../assets/styles/MainStyles');
const GlobalStyles = require('../assets/styles/GlobalStyles');
const WelcomeStyles = require('../assets/styles/WelcomeStyles');
const ThemeParser = require('../utils/ThemeParser');
const AniListAuth = require('../utils/AniListAuth');
const Info = require('../utils/Info');

export default class MyAnimeListScreen extends BaseAnimeScreen {
    static navigationOptions = ({navigation}) => ({
        header: navigation.state.params ? (navigation.state.params.hideHeader ? null : undefined) : undefined,
        title: <Text style={GlobalStyles.globalStyles.headerText}>{navigation.getParam('title') ? navigation.getParam('title') : 'Currently Watching'}</Text>,
        headerStyle: GlobalStyles.globalStyles.header,
        headerLeft: () => ( navigation.getParam('showBack') ?
                <TouchableOpacity style={MainStyles.animeScreenStyles.closeButton} onPress={navigation.getParam('hideAnimePage')}>
                    <Text><FontAwesome5Icon style={MainStyles.settingsStyles.closeButtonIcon} color={ThemeParser.redColor} name={'arrow-left'} size={28}/></Text>
                </TouchableOpacity> : null
        )
    });

    render() {
        if(!AniListAuth.loggedIn) {
            return (
                <SafeAreaView keyboardShouldPersistTaps='always' forceInset={{ top: 'never', bottom: 'always'}} style={GlobalStyles.globalStyles.safeContainer}>
                    <ImageBackground source={Info.BACKGROUND} style={WelcomeStyles.loginStyles.background}>
                        <View style={GlobalStyles.globalStyles.container}>
                            <View style={WelcomeStyles.loginStyles.topView}>
                                <View style={{flexDirection: 'row', alignContent: 'space-between'}}>
                                    <Image style={WelcomeStyles.loginStyles.logo} source={Info.WHITE_LOGO}/>
                                </View>
                                <Text style={WelcomeStyles.loginStyles.loginText}>AniList Login</Text>
                            </View>

                            <View style={WelcomeStyles.loginStyles.loginView}>
                                <Input
                                    placeholder='Token'
                                    placeholderTextColor={ThemeParser.placeholderColor}
                                    returnKeyType='done'
                                    inputStyle={WelcomeStyles.loginStyles.token}
                                    leftIcon={<FontAwesome color={ThemeParser.blueColor} size={32} name='sign-in' />}
                                    onChangeText={text => this.setState({token: text})}
                                />

                                <View style={{flex: 1, justifyContent: 'space-around'}}>
                                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                        <TouchableOpacity style={[GlobalStyles.globalStyles.ovalButton, {backgroundColor: ThemeParser.blueColor, marginBottom: 25}]} onPress={() => AniListAuth.getALCode()}>
                                            <Text style={GlobalStyles.globalStyles.buttonText}>Get Code</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[GlobalStyles.globalStyles.ovalButton, {backgroundColor: ThemeParser.redColor}]} onPress={() => {
                                            AniListAuth.login(this.state.token).then(value => {
                                                this._loadAsync();
                                            });
                                        }}>
                                            <Text style={GlobalStyles.globalStyles.buttonText}>Sign In</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </SafeAreaView>
            );
        }

        if(this.state.animeLoaded) {
            return (
                <SafeAreaView
                    style={[GlobalStyles.globalStyles.safeContainer, {backgroundColor: ThemeParser.backgroundColor}]}>
                    <NavigationEvents onDidFocus={() => this._loadAsync()} />
                    {this.AnimePageModal()}

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{flex: 1}}
                        data={AniListAuth.watchingAnime}
                        numColumns={1}
                        renderItem={({item}) => this.ListItem(item.media.id,
                            item.media.title.english !== null ? item.media.title.english : item.media.title.romaji,
                            item.media.coverImage.large,
                            item.progress,
                            item.media.episodes,
                            item.media.nextAiringEpisode)}
                        keyExtractor={(item) => item.media.id.toString()}
                        refreshControl={<RefreshControl title='Pull to refresh' titleColor={ThemeParser.textColor}
                                                        tintColor={ThemeParser.textColor}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this.onRefresh}/>}
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