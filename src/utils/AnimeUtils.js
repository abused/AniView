const URL = 'https://www9.gogoanime.io/';
const searchURL = URL + '/search.html?keyword=';
const episodeTag = '-episode-';
let options = {
    method: 'GET',
    headers: {'User-Agent': 'Mozilla/5.0'}
};

async function getAnimePage(title, originalTitle, tries) {
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

        if(link && ~link.toString().indexOf('/anime-list.html')) {
            if (tries === 1) {
                return getAnimePage(title.replace(' (TV)'), title.replace(' (TV)'), tries += 1);
            } else if (tries === 2) {
                return getAnimePage(originalTitle.split('!').join('').split('.').join(''), originalTitle, tries += 1);
            } else if (tries === 3) {
                return getAnimePage(originalTitle.split(' ').join(''), originalTitle, tries += 1);
            }
        }

        return link;
    });
}

async function getSingleEpisode(title, episode) {
    let pageURL = await getAnimePage(title, title, 1);
    return await getAnimeLink(URL + pageURL.replace('/category/', '') + episodeTag + episode);
}

async function getAnimeEpisodes(title, episodesCount) {
    let pageURL = await getAnimePage(title, title, 1);

    let episodes = {};

    for (let i = 1; i < episodesCount+1; i++) {
        episodes[i] = await getAnimeLink(URL + pageURL.replace('/category/', '') + episodeTag + i);
    }

    return episodes;
}

async function getAnimeLink(url) {
    return fetch(url, options).then(handleResponse).then(data => {
        if(data) {
            if(data.toString().split('<div class="play-video">').length >= 2) {
                return 'http:' + data.toString().split('<div class="play-video">')[1].match(/"([^"]+)"/)[1].toString();
            }
        }

        return null;
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
    getAnimePage,
    getSingleEpisode,
    getAnimeEpisodes,
    getAnimeLink,
    handleError
};