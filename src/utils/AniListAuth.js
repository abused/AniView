import {Alert, Linking} from "react-native";

const clientID = 1336;
const authURL = 'https://anilist.co/api/v2/oauth/authorize?client_id=' + clientID + '&response_type=token';
const graphURL = 'https://graphql.anilist.co/';
const loginQuery = '{Viewer{id name siteUrl avatar{large}}}';

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
    }).then(res => handleData(res, token)).catch(handleErr);
}

//TODO, FIRST MAIN WINDOW AND STUFF
function handleData(res, token) {
    if (res.ok) {
        console.log(token);
        //Utils.storeData('token', token)
    } else {
        handleErr(res)
    }
}

function handleErr(err) {
    Alert.alert(
        'Error',
        'Invalid token provided!',
        [{text: 'OK'}],
        {cancelable: true}
    );
}

module.exports = {
    clientID: clientID,
    authURL: authURL,
    graphURL: graphURL,
    getALCode: getALCode,
    login: login,
    handleData: handleData,
    handleErr: handleErr
};
