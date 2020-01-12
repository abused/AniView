const searchURL = 'https://kitsu.io/api/edge/anime?page[limit]=20&filter[text]=';
const animeURL = 'https://kitsu.io/api/edge/anime?page[limit]=20&filter[id]=';

async function searchAnime(name) {
    return await fetchQuery(searchURL + name).then(handleResponse);
}

async function getAnime(id) {
    return await fetchQuery(animeURL + id).then(handleResponse);
}

async function fetchQuery(url) {
    const headers = {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
    };

    return await fetch(url, {
        method: 'GET',
        headers: headers
    })
}

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

module.exports = {
    searchAnime,
    getAnime,
    fetchQuery
};