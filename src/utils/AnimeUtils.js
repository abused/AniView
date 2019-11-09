const URL = 'https://www9.gogoanime.io/';
const searchURL = URL + '/search.html?keyword=';
let options = {
    method: 'GET',
    headers: {'User-Agent': 'Mozilla/5.0'}
};

async function getAnimeLink(title, episode, secondCheck) {
    let link = '';
    let ULList = [];
    let storingAnime = false;

    return await fetch(searchURL + title, options).then(handleResponse).then(async response => {
        response.toString().split('\n').forEach(line => {
            if(line.indexOf('<ul class="items">') > -1) {
                storingAnime = true;
            }

            if(storingAnime) {
                ULList.push(line);
            }

            if(storingAnime && line.indexOf('</ul>') > -1) {
                storingAnime = false;
            }
        });

        for (let i = 0; i < ULList.length; i++) {
            let line = ULList[i];

            if(line.indexOf('<a') > -1) {
                link = line.match(/"([^"]+)"/)[1];
                break;
            }
        }

        return link ? fetch(URL + link.replace('/category/', '') + '-episode-' + episode, options) : null;
    }).then(handleResponse).then(data => {
        if(data) {
            if(data.toString().split('<div class="play-video">').length >= 2) {
                module.exports.anime = 'http:' + data.toString().split('<div class="play-video">')[1].match(/"([^"]+)"/)[1].toString();
                return 'http:' + data.toString().split('<div class="play-video">')[1].match(/"([^"]+)"/)[1].toString();
            }else {
                if(!secondCheck) {
                    return getAnimeLink(title.replace('!', '').replace(':', '').replace('.', ''), episode, false);
                }else {
                    module.exports.anime = null;
                    return null;
                }
            }
        }else {
            module.exports.anime = null;
            return null;
        }
    });
}

function handleResponse(response) {
    return response ? response.text().then(function (text) {
        return text;
    }) : null;
}

function handleError(error) {
    console.error(error);
}

module.exports = {
    getAnimeLink: getAnimeLink,
    handleResponse: handleResponse,
    handleError: handleError,
    anime: ''
};