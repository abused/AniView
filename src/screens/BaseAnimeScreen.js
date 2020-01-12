import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    FlatList,
    ImageBackground,
    Image,
    ScrollView,
    ActivityIndicator,
    Platform, Picker
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import {Button} from "react-native-elements";
import Modal from 'react-native-modalbox';
import ReadMore from "react-native-read-more-text";
import {WebView} from "react-native-webview";
import Accordion from 'react-native-collapsible/Accordion'
import {AdMobBanner} from 'expo-ads-admob';
import RNPickerSelect from 'react-native-picker-select';

const MainStyles = require('../assets/styles/MainStyles');
const ThemeParser = require('../utils/ThemeParser');
const AniListAuth = require('../utils/AniListAuth');
const Utils = require('../utils/Utils');
const AnimeUtils = require('../utils/AnimeUtils');

export default class BaseAnimeScreen extends React.Component {

    state = {
        animeLoaded: false,
        refreshing: false,
        search: '',
        results: [],
        animeScreenOpen: false,
        anime: {},
        loading: false,
        expanded: -1,
        page: 1,
        pageLoaded: false,
        pageEpisodes: {}
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
        this.setState({animeScreenOpen: false, expanded: -1, page: 1, pageLoaded: false, pageEpisodes: {}});
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
                    <Text numberOfLines={3} style={MainStyles.searchStyles.animeInfo}>{description}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    openAnime = (id, title) => {
        this.props.navigation.setParams({showBack: true, title: title});
        this.setState({animeScreenOpen: true, loading: true});
        this.openAnimePage(id).then(data => {
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
        if(page && page >= 1) {
            this.setState({pageLoaded: false});
            let pageEpisodes = {};
            let episodes = this.state.anime.Media.nextAiringEpisode ? this.state.anime.Media.nextAiringEpisode.episode - 1 : this.state.anime.Media.episodes;
            let episodeStart = ((page - 1) * 12) + 1;
            let episodeEnd = episodeStart + 11;

            for (let episode = episodeStart; episode <= (episodes >= episodeEnd ? episodeEnd : episodes); episode++) {
                pageEpisodes[episode] = await AnimeUtils.getSingleEpisode(this.state.anime.Media.title.romaji, episode);
            }

            this.setState({pageEpisodes, pageLoaded: true, page});
        }
    };

    AnimeEpisodesSection = () => {
        if(this.state.pageLoaded) {
            let pageSelections = [];
            for (let i = 1; i <= this.state.anime.Media.pages; i++) {
                pageSelections.push({label: 'Page: ' + i, value: i});
            }

            return(
                <View>
                    <Accordion
                        sections={Object.keys(this.state.pageEpisodes)}
                        touchableComponent={TouchableOpacity}
                        expandMultiple={false}
                        activeSections={this.state.expanded >= 0 ? [this.state.expanded] : []}
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

                            if (this.state.pageEpisodes[episode]) {
                                return (
                                    <WebView
                                        scrollEnabled={false}
                                        source={{uri: this.state.pageEpisodes[episode]}}
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

                    {this.state.anime.Media.pages > 1 ?
                        <View>
                            <Text>{'\n'}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginLeft: '10%', alignItems: 'center'}}>
                                <Button title='Prev' onPress={() => {
                                    if(this.state.page > 1) {
                                        this.openEpisodePage(this.state.page - 1);
                                    }
                                }}/>

                                <RNPickerSelect
                                    placeholder={{}}
                                    style={{...MainStyles.pickerSelectStyles, iconContainer: {padding: 4, paddingRight: 8}}}
                                    value={this.state.page}
                                    onValueChange={(value => this.openEpisodePage(value))}
                                    items={pageSelections}
                                    Icon={() => <FontAwesome5Icon color='white' name={'sort-down'} size={25}/>}
                                />

                                <Button title='Next' onPress={() => {
                                    if(this.state.page < this.state.anime.Media.pages) {
                                        this.openEpisodePage(this.state.page + 1);
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
        if(this.state.loading) {
            return(
                <Modal swipeToClose={false} isOpen={this.state.animeScreenOpen} onClosed={this._hideAnimePage}>
                    <View style={{flex: 1, backgroundColor: ThemeParser.backgroundColor, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size='large' color={ThemeParser.textColor} />
                    </View>
                </Modal>
            );
        }else {
          return(
              <Modal swipeToClose={false} isOpen={this.state.animeScreenOpen} onClosed={this._hideAnimePage}>
                  <ScrollView showsVerticalScrollIndicator={false} style={MainStyles.animeScreenStyles.animeContainer}>
                      <ImageBackground imageStyle={{borderBottomColor: ThemeParser.redColor, borderBottomWidth: 2}} style={MainStyles.animeScreenStyles.bannerImage} source={{uri: this.state.anime.Media.coverImage ? this.state.anime.Media.coverImage.extraLarge : this.state.anime.Media.bannerImage}} />

                      <View style={MainStyles.animeScreenStyles.contentContainer}>
                          <View style={{borderBottomColor: ThemeParser.textColor, borderBottomWidth: 2, marginBottom: 5}}>
                              <Text style={MainStyles.animeScreenStyles.heading}>Genres</Text>
                          </View>
                          <FlatList
                              style={MainStyles.animeScreenStyles.genreContainer}
                              data={this.state.anime.Media.genres}
                              numColumns={3}
                              renderItem={({item}) => {
                                  return(
                                      <View style={MainStyles.animeScreenStyles.genreView}>
                                          <Text style={MainStyles.animeScreenStyles.genre}>{item}</Text>
                                      </View>
                                  );
                              }}
                              keyExtractor={(item) => item.toString()}
                          />

                          <View style={{borderBottomColor: ThemeParser.textColor, borderBottomWidth: 2, marginBottom: 10}}>
                              <Text style={MainStyles.animeScreenStyles.heading}>Description</Text>
                          </View>
                          <ReadMore numberOfLines={7} renderTruncatedFooter={Utils.renderTruncatedFooter} renderRevealedFooter={Utils.renderRevealedFooter}>
                              <Text style={MainStyles.animeScreenStyles.description}>{this.state.anime.Media.description}</Text>
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

    render() {
        return null;
    }
}

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}