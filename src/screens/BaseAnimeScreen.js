import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    FlatList,
    ImageBackground,
    Image,
    ScrollView
} from "react-native";
import Modal from 'react-native-modalbox';
import ReadMore from "react-native-read-more-text";

const MainStyles = require('../assets/styles/MainStyles');
const GlobalStyles = require('../assets/styles/GlobalStyles');
const ThemeParser = require('../utils/ThemeParser');
const AniListAuth = require('../utils/AniListAuth');
const Utils = require('../utils/Utils');

export default class BaseAnimeScreen extends React.Component {

    state = {
        animeLoaded: false,
        refreshing: false,
        search: '',
        results: [],
        animeScreenOpen: false,
        anime: {}
    };

    constructor(props) {
        super(props);
        this.updateAnimeList();
        this._loadAsync();
    }

    componentWillMount() {
        this.props.navigation.setParams({hideAnimePage: this._hideAnimePage});
    }

    updateAnimeList = async () => {
        this.setState({animeLoaded: false});
        AniListAuth.getMostPopularAnime().then(() => {
            this.setState({animeLoaded: true});
        });
    };

    _loadAsync = async () => {
        this.setState({animeLoaded: false});
        this.props.navigation.setParams({hideHeader: !AniListAuth.loggedIn});

        if(AniListAuth.loggedIn) {
            await AniListAuth.getWatchingAnime(AniListAuth.userID);
            this.setState({animeLoaded: true});
        }
    };

    setRefreshing = (value) => {
        this.setState({refreshing: value});
    };

    onRefresh = () => {
        this.setRefreshing(true);
        this.updateAnimeList();
        wait(1000).then(() => this.setRefreshing(false));
    };

    _hideAnimePage = () => {
        this.setState({animeScreenOpen: false});
        this.props.navigation.setParams({showBack: false, title: null});
    };

    updateSearch = search => {
        this.setState({search});
        let searchResults = [];
        AniListAuth.getSearchResults(search, searchResults).then(val => this.setState({results: searchResults}));
    };

    HomeItem = (id, title, image) => {
        return(
            <ImageBackground source={require('../assets/images/anime_placeholder.png')} style={MainStyles.homeStyles.animeCard}>
                <TouchableOpacity style={MainStyles.homeStyles.cardContent} onPress={() => this.openAnime(id, title)}>
                    <Image source={{uri: image}} style={MainStyles.homeStyles.animeImage}/>
                    <View style={MainStyles.homeStyles.animeTitleCard}>
                        <Text numberOfLines={2} style={MainStyles.homeStyles.animeTitle}>{title}</Text>
                    </View>
                </TouchableOpacity>
            </ImageBackground>
        );
    };

    ListItem = (id, title, image, progress, episodes, nextAiring) => {
        const episodesBehind = (nextAiring.episode -1) - progress;

        return(
            <TouchableOpacity style={MainStyles.listStyles.animeCard} onPress={() => this.openAnime(id, title)}>
                <Image source={{uri: image}} style={MainStyles.listStyles.animeImage} />
                <View style={MainStyles.listStyles.animeTitleCard}>
                    <Text numberOfLines={3} style={MainStyles.listStyles.animeTitle}>{title}</Text>

                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        {episodesBehind > 0 ? <Text style={[MainStyles.listStyles.animeInfo, {color: ThemeParser.redColor}]}>{episodesBehind + ' Episode' + (episodesBehind > 1 ? 's' : '') + ' Behind!'}</Text> : null}
                        <Text style={MainStyles.listStyles.animeInfo}>{'Progress: ' + progress + (episodes != null ? ' / ' + episodes : '')}</Text>
                        {nextAiring ? <Text style={MainStyles.listStyles.animeInfo}>{'Episode ' + nextAiring.episode + ' in:'} <Text style={[MainStyles.listStyles.animeInfo, {color: ThemeParser.blueColor}]}>{Utils.secondsTimeFormat(nextAiring.timeUntilAiring)}</Text></Text> : null}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    SearchItem = (id, title, image, description) => {
        return(
            <TouchableOpacity style={MainStyles.searchStyles.animeCard} onPress={() => this.openAnime(id, title)}>
                <Image source={{uri: image}} style={MainStyles.searchStyles.animeImage} />
                <View style={MainStyles.searchStyles.animeTitleCard}>
                    <Text numberOfLines={1} style={MainStyles.searchStyles.animeTitle}>{title + '\n'}</Text>
                    <Text numberOfLines={3} style={MainStyles.searchStyles.animeInfo}>{description}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    openAnime = (id, title) => {
        AniListAuth.getAnime(id).then(data => {
            this.setState({anime: data.data.Media, animeScreenOpen: true});
            this.props.navigation.setParams({showBack: true, title: title});
        }).catch(AniListAuth.handleError);
    };

    AnimePageModal = () => {
        return (
            <Modal swipeToClose={false} isOpen={this.state.animeScreenOpen} onClosed={this._hideAnimePage}>
                <ScrollView showsVerticalScrollIndicator={false} style={MainStyles.animeScreenStyles.animeContainer}>
                    <ImageBackground imageStyle={{borderBottomColor: ThemeParser.redColor, borderBottomWidth: 2}} style={MainStyles.animeScreenStyles.bannerImage} source={{uri: this.state.anime.coverImage ? this.state.anime.coverImage.extraLarge : this.state.anime.bannerImage}}>
                    </ImageBackground>

                    <View style={MainStyles.animeScreenStyles.contentContainer}>
                        <FlatList
                            style={MainStyles.animeScreenStyles.genreContainer}
                            data={this.state.anime.genres}
                            numColumns={4}
                            renderItem={({item}) => {
                                return(
                                    <View style={MainStyles.animeScreenStyles.genreView}>
                                        <Text style={MainStyles.animeScreenStyles.genre}> {item} </Text>
                                    </View>
                                );
                            }}
                            keyExtractor={(item) => item.toString()}
                        />

                        <Text style={MainStyles.animeScreenStyles.heading}>Description</Text>
                        <ReadMore numberOfLines={7} renderTruncatedFooter={Utils.renderTruncatedFooter} renderRevealedFooter={Utils.renderRevealedFooter}>
                            <Text style={MainStyles.animeScreenStyles.description}>{this.state.anime.description}</Text>
                        </ReadMore>

                        <FlatList
                            data={this.state.anime.streamingEpisodes}
                            renderItem={({item}) => {
                                return (
                                    <TouchableOpacity style={MainStyles.animeScreenStyles.episodeCard} onPress={() => console.log(item.title)}>
                                        <Image source={{uri: item.thumbnail}} style={MainStyles.animeScreenStyles.animeImage} />
                                        <View style={MainStyles.animeScreenStyles.animeEpisodeCard}>
                                            <Text style={MainStyles.animeScreenStyles.animeEpisodeNumber}>{item.title.split(' - ')[0]}</Text>
                                            <Text numberOfLines={3} style={MainStyles.animeScreenStyles.animeEpisodeTitle}>{item.title.split(' - ')[1]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            numColumns={1}
                            keyExtractor={(item) => Utils.getEpisode(item.title).toString()}
                        />
                    </View>
                </ScrollView>
            </Modal>
        );
    };

    render() {
        return null;
    }
}

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}