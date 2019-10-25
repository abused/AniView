import {Alert, Linking} from "react-native";

const clientID = 1336;
const authURL = 'https://anilist.co/api/v2/oauth/authorize?client_id=' + clientID + '&response_type=token';
const graphURL = 'https://graphql.anilist.co/';
const loginQuery = '{Viewer{id name siteUrl avatar{large}}}';
const popularQuery = `
  {
    Page (perPage: 36){
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title {
          english
        }
        coverImage {
          large
        }
      }
    }
  }`;

function getALCode() {
    Linking.openURL(authURL).catch(err => console.error(err));
}

async function login(token) {
    await fetch(graphURL, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: loginQuery
        })
    }).then(res => handleLoginData(res, token)).catch(handleLoginErr);
}

async function getMostPopularAnime() {
    await fetch(graphURL, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'Accept': 'application/json'
       } ,
        body: JSON.stringify({query: popularQuery})
    }).then(handleResponse).then(handleData).catch(handleError);

    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    function handleData(data) {
        module.exports.trendingAnime.length = 0;

        data.data.Page.media.forEach(function (value) {
            module.exports.trendingAnime.push(value);
        });
    }

    function handleError(error) {
        console.error(error);
    }
}

//TODO, FIRST MAIN WINDOW AND STUFF
function handleLoginData(res, token) {
    if (res.ok) {
        console.log(token);
        //Utils.storeData('token', token)
    } else {
        handleLoginErr(res)
    }
}

function handleLoginErr(err) {
    Alert.alert(
        'Error',
        'Invalid token provided!',
        [{text: 'OK'}],
        {cancelable: true}
    );
}

/*
async fetchAnime(id) {
    const { body } = await request
        .post('https://graphql.anilist.co/')
        .send({
            variables: {
                id,
                type: 'ANIME'
            },
            query: resultGraphQL
        });
    return body.data.Media;
}
*/

module.exports = {
    clientID: clientID,
    authURL: authURL,
    graphURL: graphURL,
    getALCode: getALCode,
    login: login,
    handleLoginData: handleLoginData,
    handleLoginErr: handleLoginErr,
    getMostPopularAnime: getMostPopularAnime,
    trendingAnime: []
};
