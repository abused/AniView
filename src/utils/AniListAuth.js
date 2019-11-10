//TODO SWITCH BACK TO ANILIST ONCE THEY MOVE AWAY FROM CRUNCHYROLL!
import {Alert, Linking} from "react-native";
import {loginQuery, notificationsQuery, trendingAnimeQuery, watchingAnimeQuery, searchAnimeQuery, getAnimeQuery, getAnimeEpisodes} from './GraphQLQueries';
const Utils = require('./Utils');
const KitsuAniUtils = require('./KitsuAniUtils');
const AnimeUtils = require('./AnimeUtils');

const clientID = 1336;
const authURL = 'https://anilist.co/api/v2/oauth/authorize?client_id=' + clientID + '&response_type=token';
const graphURL = 'https://graphql.anilist.co/';

function getALCode() {
    Linking.openURL(authURL).catch(err => console.error(err));
}

async function loadUserData() {
    Utils.retrieveData('userToken').then(value => {
        if(value !== null)
            this.login(value);
    });
}

async function logout() {
    await Utils.deleteData('userID');
    await Utils.deleteData('userToken');
    await Utils.deleteData('userName');
    await Utils.deleteData('userAvatar');
    module.exports.userID = '';
    module.exports.userToken = '';
    module.exports.userName = '';
    module.exports.userAvatar = '';
    module.exports.loggedIn = false;
}

async function login(token) {
    return await fetchQuery(loginQuery, token).then(handleLoginResponse).then(handleData).catch(handleLoginErr);

    function handleLoginResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    function handleData(data) {
        Utils.storeData('userID', data.data.Viewer.id.toString());
        Utils.storeData('userToken', token.toString());
        Utils.storeData('userName', data.data.Viewer.name.toString());
        Utils.storeData('userAvatar', data.data.Viewer.avatar.large.toString());
        module.exports.userID = data.data.Viewer.id.toString();
        module.exports.userToken = token.toString();
        module.exports.userName = data.data.Viewer.name.toString();
        module.exports.userAvatar = data.data.Viewer.avatar.large.toString();
        module.exports.loggedIn = true;
    }

    function handleLoginErr(err) {
        Alert.alert(
            'Error',
            'Invalid token provided!',
            [{text: 'OK'}],
            {cancelable: true}
        );
    }
}

async function getUnreadNotifications() {
    return await fetchQuery(notificationsQuery, await Utils.retrieveData('userToken'), {types: ['AIRING']}).then(handleResponse).then(handleData);

    function handleData(data) {
        console.log(data);
        for (let i = 0; i < data.data.Viewer.unreadNotificationsCount; i++) {
            data.data.Page.notifications[i].unread = true;
        }

        return data;
    }
}

async function getMostPopularAnime() {
    return await fetchQuery(trendingAnimeQuery).then(handleResponse).then(handleData).catch(handleError);

    function handleData(data) {
        if(data.data.Page.media.length > 0) {
            module.exports.trendingAnime.length = 0;

            data.data.Page.media.forEach(function (value) {
                if (value.id !== null)
                    module.exports.trendingAnime.push(value);
            });
        }
    }
}

async function getWatchingAnime(userID) {
    return await fetchQuery(watchingAnimeQuery, null, {user: userID}).then(handleResponse).then(handleData).catch(handleError);

    function handleData(data) {
        if(data.data.Page.mediaList.length > 0) {
            module.exports.watchingAnime.length = 0;

            data.data.Page.mediaList.forEach(function (value) {
                if (value.media.id !== null)
                    module.exports.watchingAnime.push(value);
            });
        }
    }
}

async function getSearchResults(string, list) {
    return await fetchQuery(searchAnimeQuery, null, {search: string}).then(handleResponse).then(handleData).catch(handleError);

    function handleData(data) {
        list.length = 0;
        if(data.data.Page.media.length > 0) {
            data.data.Page.media.forEach(function (value) {
                if (value.id !== null)
                    list.push(value);
            });
        }
    }
}

async function getAnime(id) {
    return await fetchQuery(getAnimeQuery, null, {animeId: id}).then(handleResponse);
}

//Switched to Kitsu for now
async function getAnimeByName(name) {
    module.exports.watchingAnime.animeEpisodes = 0;
    return await KitsuAniUtils.searchAnime(name).then(async data => {
        let convertedData = {
            id: data.data[0].id,
            episodes: data.data[0].attributes.episodeCount,
            description: data.data[0].attributes.synopsis,
            genres: [],
            title: {
                english: data.data[0].attributes.titles.en,
                romaji: data.data[0].attributes.titles.en_jp
            },
            coverImageValid: data.data[0].attributes.coverImage ? true : false,
            bannerImage: data.data[0].attributes.coverImage ? data.data[0].attributes.coverImage.original : data.data[0].attributes.posterImage.large,
            coverImage: {
                large: data.data[0].attributes.posterImage.medium,
                extraLarge:  data.data[0].attributes.posterImage.original,
            },
            streamingEpisodes: [],
            nextAiringEpisode: null,
            episodesLink: data.data[0].relationships.episodes.links.related,
            genresLink: data.data[0].relationships.categories.links.related
        };

        let count = 1;
        await fetchQuery(searchAnimeQuery, null, {search: convertedData.title.english ? convertedData.title.english : convertedData.title.romaji}).then(handleResponse).then(async aniData => {
            await fetchQuery(getAnimeEpisodes, null, {animeId: aniData.data.Page.media[0].id}).then(handleResponse).then(episodeData => {
                count = episodeData.data.Media.nextAiringEpisode ? episodeData.data.Media.nextAiringEpisode.episode - 1 : data.data[0].attributes.episodeCount;
            }).catch(handleError);
        }).catch(handleError);

        if(count > 20) {
            for (let i = 0; i < count / 20; i++) {
                await KitsuAniUtils.fetchQuery(data.data[0].relationships.episodes.links.related + '?page[limit]=20&page[offset]=' + i * 20).then(handleResponse).then(episodeData => {
                    episodeData.data.forEach(async episode => {
                        await handleEpisodeData(convertedData.title.romaji, episode, convertedData.streamingEpisodes, convertedData.bannerImage);
                    });
                }).catch(handleError);
            }
        }else {
            await KitsuAniUtils.fetchQuery(data.data[0].relationships.episodes.links.related + '?page[limit]=20').then(handleResponse).then(episodeData => {
                episodeData.data.forEach(async episode => {
                    await handleEpisodeData(convertedData.title.romaji, episode, convertedData.streamingEpisodes, convertedData.bannerImage);
                });
            }).catch(handleError);
        }

        await KitsuAniUtils.fetchQuery(data.data[0].relationships.categories.links.related).then(handleResponse).then(genreData => {
            genreData.data.forEach(genre => {
                convertedData.genres.push(genre.attributes.title);
            });
        }).catch(handleError);

        return convertedData;
    });
}

async function handleEpisodeData(title, episode, list, banner) {
    if (episode.attributes.titles.en_us) {
        list.push({
            title: 'Episode ' + episode.attributes.number + ' - ' + episode.attributes.titles.en_us,
            thumbnail: episode.attributes.thumbnail.original
        });
        module.exports.animeEpisodes.push(await AnimeUtils.getAnimeLink(title, episode.attributes.number, false));
    } else if (episode.attributes.airdate) {
        list.push({
            title: 'Episode ' + episode.attributes.number + ' - Title Not Currently Available!',
            thumbnail: banner
        });
        module.exports.animeEpisodes.push(await AnimeUtils.getAnimeLink(title, episode.attributes.number, false));
    }
}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

async function fetchQuery(graphQuery, token, vars) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    if(token)
        headers.Authorization = 'Bearer ' + token;

    return await fetch(graphURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({query: graphQuery, variables: vars})
    })
}

function handleError(error) {
    console.error(error);
}

module.exports = {
    clientID: clientID,
    authURL: authURL,
    graphURL: graphURL,
    getALCode: getALCode,
    login: login,
    getUnreadNotifications: getUnreadNotifications,
    getMostPopularAnime: getMostPopularAnime,
    getWatchingAnime: getWatchingAnime,
    loadUserData: loadUserData,
    getSearchResults: getSearchResults,
    logout: logout,
    //getAnime: getAnime,
    getAnimeByName: getAnimeByName,
    handleError: handleError,
    loggedIn: false,
    userToken: '',
    userName: '',
    userAvatar: '',
    trendingAnime: [],
    watchingAnime: [],
    animeEpisodes: []
};
