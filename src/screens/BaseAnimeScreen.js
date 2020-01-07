import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    FlatList,
    ImageBackground,
    Image,
    ScrollView,
    ActivityIndicator
} from "react-native";
import Modal from 'react-native-modalbox';
import ReadMore from "react-native-read-more-text";
import {WebView} from "react-native-webview";
import Accordion from 'react-native-collapsible/Accordion'
import {AdMobBanner} from 'expo-ads-admob';

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
        expanded: -1
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
        this.setState({animeScreenOpen: false, expanded: -1});
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
        this.setState({animeScreenOpen: true, loading: true});
        AniListAuth.getAnimeByName(title).then(data => {
            this.setState({anime: data, loading: false});
            this.props.navigation.setParams({showBack: true, title: title});
        }).catch(AniListAuth.handleError);

        /*
        * Switched to Kitsu for now since AniList relies heavily on Crunchyroll
        AniListAuth.getAnime(id).then(data => {
            if(data.data.Media.streamingEpisodes.length <= 0) {
                let episodeCount = data.data.Media.nextAiringEpisode ? data.data.Media.nextAiringEpisode.episode : data.data.Media.episodes + 1;
                for (let i = 1; i < episodeCount; i++) {
                    data.data.Media.streamingEpisodes.push({
                        title: 'Episode ' + i.toString(),
                        thumbnail: data.data.Media.bannerImage
                    });
                }
            }else {
                let episodeCount = data.data.Media.nextAiringEpisode ? data.data.Media.nextAiringEpisode.episode : data.data.Media.episodes + 1;
                let ep = 1;
                let episodeNumberArr = [];
                let episodeData = [];

                data.data.Media.streamingEpisodes.forEach((episode, index, arr) => {
                    if (!isNaN(Utils.getEpisode(episode.title))) {
                        episodeNumberArr.push(Utils.getEpisode(episode.title));
                        episodeData.push(ep);
                        ep += 1;
                    } else {
                        arr.splice(index, 1);
                    }
                });
                episodeNumberArr.sort((a, b) => a - b);
                episodeData.sort((a, b) => a - b);

                let isCountGreater = Utils.getEpisode(episodeNumberArr[episodeNumberArr.length - 1]) > episodeCount;
                for (let i = 1; i < episodeCount; i++) {
                    data.data.Media.streamingEpisodes.forEach((episode, index, arr) => {
                        if (episode.title.indexOf('Episode ' + episodeNumberArr[i - 1]) > -1) {
                            arr[index] = {
                                title: isCountGreater ? 'Episode ' + episodeData[i - 1] + ' -' + episode.title.split('-')[1] : episode.title,
                                thumbnail: episode.thumbnail
                            };
                        }
                    });
                }
            }

            this.setState({anime: data.data.Media, animeScreenOpen: true});
            this.props.navigation.setParams({showBack: true, title: title});
        }).catch(AniListAuth.handleError);
        */
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
                      <ImageBackground imageStyle={{borderBottomColor: ThemeParser.redColor, borderBottomWidth: 2}} style={MainStyles.animeScreenStyles.bannerImage} source={{uri: this.state.anime.coverImage ? this.state.anime.coverImage.extraLarge : this.state.anime.bannerImage}} />

                      <View style={MainStyles.animeScreenStyles.contentContainer}>
                          <View style={{borderBottomColor: ThemeParser.textColor, borderBottomWidth: 2, marginBottom: 5}}>
                              <Text style={MainStyles.animeScreenStyles.heading}>Genres</Text>
                          </View>
                          <FlatList
                              style={MainStyles.animeScreenStyles.genreContainer}
                              data={this.state.anime.genres}
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
                              <Text style={MainStyles.animeScreenStyles.description}>{this.state.anime.description}</Text>
                          </ReadMore>

                          <Accordion
                              sections={this.state.anime.streamingEpisodes}
                              touchableComponent={TouchableOpacity}
                              expandMultiple={false}
                              activeSections={this.state.expanded >= 0 ? [this.state.expanded] : []}
                              renderHeader={(item) => {
                                  return (
                                        <TouchableOpacity style={MainStyles.animeScreenStyles.episodeCard} onPress={() => {
                                            this.setState({expanded: Utils.getEpisode(item.title) - 1});
                                        }}>

                                            <Image source={{uri: item.thumbnail}} style={MainStyles.animeScreenStyles.animeImage} />
                                            {getAnimeTitleRender(item.title)}
                                        </TouchableOpacity>
                                  );
                              }}
                              renderContent={(item) => {
                                  if(AnimeUtils.anime && AnimeUtils.anime !== '') {
                                      return (
                                          <WebView
                                              scrollEnabled={false}
                                              source={{ uri: AniListAuth.getEpisodeLink(Utils.getEpisode(item.title))}}
                                              onShouldStartLoadWithRequest={request => {
                                                  return request.url.startsWith('http://vidstreaming.io/streaming.php?id=');
                                              }}
                                              style={MainStyles.animeScreenStyles.animeWebView}
                                          />
                                      );
                                  }else {
                                      return (
                                          <View style={[MainStyles.animeScreenStyles.animeWebView, {backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}]}>
                                              <ActivityIndicator size='large' color={ThemeParser.textColor} />
                                              <Text style={{color: ThemeParser.textColor, fontSize: 18}}>Video Is Currently Processing!</Text>
                                          </View>
                                      );
                                  }
                              }}
                              onChange={sections => {
                                  console.log(sections.toString());
                                  this.setState({expanded: sections})
                              }}
                          />
                      </View>

                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                          <AdMobBanner
                              bannerSize='banner'
                              adUnitID='ca-app-pub-6445224790923907/1898144067'
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

function getAnimeTitleRender(title) {
    if(title.split(' - ').length >= 2) {
        return (
            <View style={MainStyles.animeScreenStyles.animeEpisodeCard}>
                <Text style={MainStyles.animeScreenStyles.animeEpisodeNumber}>{title.split(' - ')[0]}</Text>
                <Text numberOfLines={3} style={MainStyles.animeScreenStyles.animeEpisodeTitle}>{title.split(' - ')[1]}</Text>
            </View>
        );
    }else {
        return (
            <View style={MainStyles.animeScreenStyles.animeEpisodeCard}>
                <Text style={MainStyles.animeScreenStyles.animeEpisodeNumber}>{title}</Text>
            </View>
        );
    }
}

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}