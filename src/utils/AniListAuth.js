import {Alert, Linking} from "react-native";
import {loginQuery, notificationsQuery, trendingAnimeQuery, watchingAnimeQuery, searchAnimeQuery, getAnimeQuery, updateProgressQuery, updateStatusQuery, getProgressQuery} from './GraphQLQueries';
const Utils = require('./Utils');
const AnimeUtils = require('./AnimeUtils');

const clientID = 2722;
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
    return fetchQuery(getAnimeQuery, null, {animeId: id}).then(handleResponse).then(data => {
        let episodes = data.data.Media.nextAiringEpisode ? data.data.Media.nextAiringEpisode.episode -1 : data.data.Media.episodes;
        data.data.Media.pages = Math.ceil(episodes > 0 ? episodes / 12 : 0);
        data.data.Media.streamingEpisodes = [];

        for (let i = 1; i < episodes+1; i++) {
            data.data.Media.streamingEpisodes.push('Episode ' + i.toString());
        }

        return data.data;
    });
}

async function updateStatus(id, status) {
    return fetchQuery(updateStatusQuery, module.exports.userToken, {listId: id, status}).then(handleResponse).catch(console.error);
}

function updateProgress(id, progress) {
    return fetchQuery(updateProgressQuery, module.exports.userToken, {listId: id, progress}).then(handleResponse).catch(console.error);
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
    updateStatus,
    updateProgress,
    clientID,
    authURL,
    graphURL,
    getALCode,
    login,
    getUnreadNotifications,
    getMostPopularAnime,
    getWatchingAnime,
    loadUserData,
    getSearchResults,
    logout,
    getAnime,
    handleError,
    handleResponse,
    fetchQuery,
    loggedIn: false,
    userToken: '',
    userName: '',
    userAvatar: '',
    trendingAnime: [],
    watchingAnime: [],
    episodeLinks: {}
};
