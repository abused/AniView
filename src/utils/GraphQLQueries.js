const loginQuery = `
{
    Viewer {
        id
        name
        siteUrl
        avatar {
            large
        }
    }
}
`;

const trendingAnimeQuery = `
{
    Page(perPage: 50) {
        media(type: ANIME, sort: TRENDING_DESC) {
            id
            title {
                english
                romaji
            }
            coverImage {
                large
            }
        }
    }
}
`;

const watchingAnimeQuery = `
query($user: Int) {
    Page(perPage: 50) {
        mediaList(userId: $user, status_in: [CURRENT], type: ANIME, sort: UPDATED_TIME_DESC) {
            id
            progress
            media {
                title {
                    english
                    romaji
                }
                id
                episodes
                duration
                coverImage {
                    large
                }
                nextAiringEpisode {
                    episode
                    timeUntilAiring
                }
            }
        }
    }
}
`;

const getAnimeQuery = `
query($animeId: Int) {
    Media(id: $animeId) {
        id
        episodes
        description(asHtml: false)
        genres
        title {
            english
            romaji
        }
        bannerImage
        coverImage {
            large
            extraLarge
        }
        streamingEpisodes {
            title
            thumbnail
        }
    }
}
`;

const searchAnimeQuery = `
query ($search: String) {
    Page(perPage: 10) {
        media(search: $search) {
            id
            description(asHtml: false)
            title {
                english
                romaji
            }
            coverImage {
                large
            }
        }
    }
}
`;

module.exports = {
  loginQuery: loginQuery,
  trendingAnimeQuery: trendingAnimeQuery,
  watchingAnimeQuery: watchingAnimeQuery,
  getAnimeQuery: getAnimeQuery,
  searchAnimeQuery: searchAnimeQuery
};