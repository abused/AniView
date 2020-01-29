import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    ImageBackground,
    Image,
    ScrollView,
    ActivityIndicator,
    Platform
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import {Button} from "react-native-elements";
import Modal from 'react-native-modalbox';
import ReadMore from "react-native-read-more-text";
import {WebView} from "react-native-webview";
import Accordion from 'react-native-collapsible/Accordion'
import {AdMobBanner} from 'expo-ads-admob';
import RNPickerSelect from 'react-native-picker-select';
import {getProgressQuery} from "../utils/GraphQLQueries";

const MainStyles = require('../assets/styles/MainStyles');
const ThemeParser = require('../utils/ThemeParser');
const AniListAuth = require('../utils/AniListAuth');
const Utils = require('../utils/Utils');
const AnimeUtils = require('../utils/AnimeUtils');

let statuses = [{label: 'WATCHING', value: 'CURRENT'}, {label: 'PLANNING', value: 'PLANNING'}, {label: 'COMPLETED', value: 'COMPLETED'}, {label: 'DROPPED', value: 'DROPPED'}, {label: 'PAUSED', value: 'PAUSED'}, {label: 'RE-WATCHING', value: 'RE-WATCHING'}];

export default class BaseAnimeScreen extends React.Component {

    state = {
        animeScreenOpen: false,
        animeLoaded: false,
        pageLoaded: false,
        refreshing: false,
        loading: false,
        pageEpisodes: {},
        results: [],
        anime: {},
        expanded: -1,
        page: 1,
        search: '',
        status: '',
        progress: '',
        simpleStyle: false
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
        }
        Utils.retrieveData('simpleStyle').then(value => {
            this.setState({simpleStyle: value === 'true'});
        });

        this.setState({animeLoaded: true});
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
        this.setState({animeScreenOpen: false, expanded: -1, page: 1, pageLoaded: false, pageEpisodes: {}});
        this.props.navigation.setParams({showBack: false, title: null});
    };

    updateSearch = search => {
        this.setState({search});
        let searchResults = [];
        AniListAuth.getSearchResults(search, searchResults).then(val => this.setState({results: searchResults}));
    };

    HomeItem = (id, title, image) => {
        let {simpleStyle} = this.state;
        let homeStyles = simpleStyle ? MainStyles.simpleHomeStyles : MainStyles.extendedHomeStyles;

        return(
            <ImageBackground source={require('../assets/images/anime_placeholder.png')} style={homeStyles.animeCard}>
                <TouchableOpacity style={homeStyles.cardContent} onPress={() => this.openAnime(id, title)}>
                    <Image source={{uri: image}} style={homeStyles.animeImage}/>
                    <View style={homeStyles.animeTitleCard}>
                        <Text numberOfLines={simpleStyle ? 6 : 2} style={homeStyles.animeTitle}>{title}</Text>
                    </View>
                </TouchableOpacity>
            </ImageBackground>
        );
    };

    ListItem = (id, title, image, progress, episodes, nextAiring) => {
        const episodesBehind = (nextAiring ? nextAiring.episode -1 : episodes) - progress;

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
                    <Text numberOfLines={3} style={MainStyles.searchStyles.animeInfo}>{description ? description.replace(/(<([^>]+)>)/ig, '') : ''}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    openAnime = (id, title) => {
        this.props.navigation.setParams({showBack: true, title: title});
        this.setState({animeScreenOpen: true, loading: true});
        this.openAnimePage(id).then(data => {
            AniListAuth.fetchQuery(getProgressQuery, null, {animeId: id, user: AniListAuth.loggedIn? AniListAuth.userID: 0}).then(res => res.ok ? AniListAuth.handleResponse(res) : null).then(data => {
                this.setState({status: data ? data.data.MediaList.status : '', progress: data ? data.data.MediaList.progress : 0})
            });

            this.openEpisodePage(1);
        });
    };

    openAnimePage = async (id) => {
        return AniListAuth.getAnime(id).then(data => {
            this.setState({anime: data, loading: false});
            return data;
        });
    };

    openEpisodePage = async (page) => {
        let {anime} = this.state;

        if(page && page >= 1) {
            this.setState({pageLoaded: false});
            let pageEpisodes = {};
            let episodes = anime.Media.nextAiringEpisode ? anime.Media.nextAiringEpisode.episode - 1 : anime.Media.episodes;
            let episodeStart = ((page - 1) * 12) + 1;
            let episodeEnd = episodeStart + 11;

            for (let episode = episodeStart; episode <= (episodes >= episodeEnd ? episodeEnd : episodes); episode++) {
                pageEpisodes[episode] = await AnimeUtils.getSingleEpisode(anime.Media.title.romaji, episode);
            }

            this.setState({pageEpisodes, pageLoaded: true, page});
        }
    };

    AnimeEpisodesSection = () => {
        let {pageLoaded, anime, pageEpisodes, expanded, page} = this.state;

        if(pageLoaded) {
            let pageSelections = [];
            for (let i = 1; i <= anime.Media.pages; i++) {
                pageSelections.push({label: 'Page: ' + i, value: i});
            }

            return(
                <View>
                    <Accordion
                        sections={Object.keys(pageEpisodes)}
                        touchableComponent={TouchableOpacity}
                        expandMultiple={false}
                        activeSections={expanded >= 0 ? [expanded] : []}
                        renderHeader={(item) => {
                            let episode = parseInt(item);
                            return (
                                <TouchableOpacity style={MainStyles.animeScreenStyles.episodeCard} onPress={() => this.setState({expanded: episode - 1})}>
                                    <Text style={MainStyles.animeScreenStyles.animeEpisodeNumber}>{'Episode ' + item}</Text>
                                </TouchableOpacity>
                            );
                        }}
                        renderContent={(item) => {
                            let episode = parseInt(item);

                            if (pageEpisodes[episode]) {
                                return (
                                    <WebView
                                        allowsFullscreenVideo={true}
                                        scrollEnabled={false}
                                        source={{uri: pageEpisodes[episode]}}
                                        onShouldStartLoadWithRequest={request => {
                                            return request.url.startsWith('http://vidstreaming.io/streaming.php?id=');
                                        }}
                                        style={MainStyles.animeScreenStyles.animeWebView}
                                    />
                                );
                            } else {
                                return (
                                    <View style={[MainStyles.animeScreenStyles.animeWebView, {
                                        backgroundColor: 'black',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }]}>
                                        <ActivityIndicator size='large' color={ThemeParser.textColor}/>
                                        <Text style={{color: ThemeParser.textColor, fontSize: 18}}>Video Is
                                            Currently Processing!</Text>
                                    </View>
                                );
                            }
                        }}
                        onChange={sections => {
                            this.setState({expanded: sections})
                        }}
                    />

                    {anime.Media.pages > 1 ?
                        <View>
                            <Text>{'\n'}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginLeft: '10%', alignItems: 'center'}}>
                                <Button title='Prev' onPress={() => {
                                    if(page > 1) {
                                        this.openEpisodePage(page - 1);
                                    }
                                }}/>

                                <RNPickerSelect
                                    placeholder={{}}
                                    style={{...MainStyles.pagePickerSelectStyles, iconContainer: {padding: 4, paddingRight: 8}}}
                                    value={page}
                                    onValueChange={(value => this.openEpisodePage(value))}
                                    items={pageSelections}
                                    Icon={() => <FontAwesome5Icon color='white' name={'sort-down'} size={25}/>}
                                    useNativeAndroidPickerStyle={false}
                                />

                                <Button title='Next' onPress={() => {
                                    if(page < anime.Media.pages) {
                                        this.openEpisodePage(page + 1);
                                    }
                                }}/>
                            </View>
                            <Text>{'\n'}</Text>
                        </View>
                        : null
                    }
                </View>
            );
        }else {
            return (
                <View style={{flex: 1, backgroundColor: ThemeParser.backgroundColor, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size='large' color={ThemeParser.textColor} />
                    <Text style={[MainStyles.animeScreenStyles.heading, {color: ThemeParser.textColor}]}>Loading Episodes!</Text>
                </View>
            );
        }
    };

    AnimePageModal = () => {
        let {loading, animeScreenOpen, anime} = this.state;

        if(loading) {
            return(
                <Modal swipeToClose={false} isOpen={animeScreenOpen} onClosed={this._hideAnimePage}>
                    <View style={{flex: 1, backgroundColor: ThemeParser.backgroundColor, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size='large' color={ThemeParser.textColor} />
                    </View>
                </Modal>
            );
        }else {
            let episodes = anime.Media.nextAiringEpisode ? anime.Media.nextAiringEpisode.episode - 1 : anime.Media.episodes;

            return(
              <Modal swipeToClose={false} isOpen={animeScreenOpen} onClosed={this._hideAnimePage}>
                  <ScrollView showsVerticalScrollIndicator={false} style={MainStyles.animeScreenStyles.animeContainer}>
                      <View style={MainStyles.animeScreenStyles.infoContainer}>
                          <Image source={{uri: anime.Media.coverImage ? anime.Media.coverImage.extraLarge : anime.Media.bannerImage}} style={MainStyles.animeScreenStyles.bannerImage} />

                          <View>
                              <View style={MainStyles.animeScreenStyles.animeTitle}>
                                  <Text style={{color: ThemeParser.textColor, fontWeight: 'bold', fontSize: 16}}>{anime.Media.title.english}</Text>
                              </View>

                              <View style={MainStyles.animeScreenStyles.info}>
                                  <View style={MainStyles.animeScreenStyles.infoColumn}>
                                      <Text>
                                          <Text style={MainStyles.animeScreenStyles.infoTitle}>Type</Text>
                                          {'\n'}
                                          <Text style={MainStyles.animeScreenStyles.infoText}>{anime.Media.format}</Text>
                                      </Text>

                                      <Text>
                                          <Text style={MainStyles.animeScreenStyles.infoTitle}>Episodes</Text>
                                          {'\n'}
                                          <Text style={MainStyles.animeScreenStyles.infoText}>{episodes}</Text>
                                      </Text>

                                      <Text>
                                          <Text style={MainStyles.animeScreenStyles.infoTitle}>Season</Text>
                                          {'\n'}
                                          <Text style={MainStyles.animeScreenStyles.infoText}>{anime.Media.season + ' ' + anime.Media.seasonYear}</Text>
                                      </Text>
                                  </View>

                                  <View style={MainStyles.animeScreenStyles.infoColumn}>
                                      <Text>
                                          <Text style={MainStyles.animeScreenStyles.infoTitle}>Genres</Text>
                                          {'\n'}
                                          <Text style={MainStyles.animeScreenStyles.infoText}>{anime.Media.genres.join(', ')}</Text>
                                      </Text>
                                  </View>

                                  <View style={MainStyles.animeScreenStyles.infoColumn}>
                                      <Text>
                                          <Text style={MainStyles.animeScreenStyles.infoTitle}>Status</Text>
                                          {'\n'}
                                          <Text style={MainStyles.animeScreenStyles.infoText}>{anime.Media.status}</Text>
                                      </Text>

                                      <Text>
                                          <Text style={MainStyles.animeScreenStyles.infoTitle}>Score</Text>
                                          {'\n'}
                                          <Text style={MainStyles.animeScreenStyles.infoText}>{anime.Media.averageScore + '%'}</Text>
                                      </Text>
                                  </View>
                              </View>
                          </View>
                      </View>

                      {this.AnimePageMedia()}

                      <View style={MainStyles.animeScreenStyles.contentContainer}>
                          <ReadMore numberOfLines={6} renderTruncatedFooter={Utils.renderTruncatedFooter} renderRevealedFooter={Utils.renderRevealedFooter}>
                              <Text style={MainStyles.animeScreenStyles.description}>{anime.Media.description.replace(/(<([^>]+)>)/ig, '')}</Text>
                          </ReadMore>

                          <View style={{borderBottomColor: ThemeParser.textColor, borderBottomWidth: 2, marginBottom: 5}}>
                              <Text style={MainStyles.animeScreenStyles.heading}>Episodes</Text>
                          </View>

                          {this.AnimeEpisodesSection()}
                      </View>

                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                          <AdMobBanner
                              bannerSize='banner'
                              adUnitID={Platform.OS === 'ios' ? 'ca-app-pub-6445224790923907/1898144067' : 'ca-app-pub-6445224790923907/8437263538'}
                              servePersonalizedAds
                              onDidFailToReceiveAdWithError={err => console.log(err)}
                          />
                      </View>
                  </ScrollView>
              </Modal>
          ) ;
        }
    };

    AnimePageMedia = () => {
        let {anime, status, progress} = this.state;

        if(AniListAuth.loggedIn && status) {
            let progressSelections = [];
            let episodes = anime.Media.episodes ? anime.Media.episodes : anime.Media.nextAiringEpisode.episode - 1;

            for (let i = 0; i <= episodes; i++) {
                progressSelections.push({label: i + ' / ' + episodes + ' EP', value: i});
            }

            return (
                <View style={MainStyles.animeScreenStyles.progress}>
                    <RNPickerSelect
                        placeholder={{}}
                        style={{...MainStyles.pickerSelectStyles, iconContainer: {top: 8, right: 10}}}
                        value={status}
                        onValueChange={value => value !== statuses ? AniListAuth.updateStatus(anime.Media.id, value).then(res => this.setState({status: value})) : null}
                        items={statuses}
                        Icon={() => <FontAwesome5Icon color='white' name={'sort-down'} size={15}/>}
                        useNativeAndroidPickerStyle={false}
                    />

                    <RNPickerSelect
                        placeholder={{}}
                        style={{...MainStyles.pickerSelectStyles, iconContainer: {top: 8, right: 10}}}
                        value={progress}
                        onValueChange={value => value !== progress ? AniListAuth.updateProgress(anime.Media.id, value).then(res => this.setState({progress: value})) : null}
                        items={progressSelections}
                        Icon={() => <FontAwesome5Icon color='white' name={'sort-down'} size={15}/>}
                        useNativeAndroidPickerStyle={false}
                    />
                </View>
            );
        }

        return null;
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