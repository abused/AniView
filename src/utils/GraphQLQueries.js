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

const notificationsQuery = `
query($types: [NotificationType]) {
    Viewer {
        unreadNotificationCount
    }
    Page(perPage: 20) {
        notifications(resetNotificationCount: true, type_in: $types) {
            ... on AiringNotification {
                media {
                    title {
                        userPreferred
                    }
                }
                episode
            }
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
        nextAiringEpisode {
            episode
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

const getAnimeEpisodes = `
query($animeId: Int) {
    Media(id: $animeId) {
        nextAiringEpisode {
            episode
        }
    }
}
`;

module.exports = {
  loginQuery,
  notificationsQuery,
  trendingAnimeQuery,
  watchingAnimeQuery,
  getAnimeQuery,
  searchAnimeQuery,
  getAnimeEpisodes
};