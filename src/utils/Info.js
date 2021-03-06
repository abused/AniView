import {Dimensions} from 'react-native';

const DISCORD_LINK = 'https://discord.gg/KseTWt5';
const ISSUES_LINK = 'https://github.com/abused/AniView/issues';

const BACKGROUND = require('./../assets/images/background-light.png');
const TRANS_LOGO = require('./../assets/images/transparent_logo.png');
const WHITE_LOGO = require('./../assets/images/white_logo.png');
const GRAY_LOGO = require('./../assets/images/gray_logo.png');
const SPLASH = require('./../assets/images/splash.png');

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const ABOUT = `
AniView does not host any of the content displayed.
All content is scrapped from third party anime sites such as,
GogoAnime, KissAnime, 4Anime, 9Anime
Anime videos are streamed to your phone from the links on their websites,
removing all advertisements with them.
AniView does not take responsibility for any content you watch, it simply lists all anime from AniList,
and proceeds to search third party anime sites to display the video from their sources.
AniView is in no way affiliated with any of the third party streaming sites listed above.
If you have any issues, please contact the respective media providers.
`;

const REMOVE_ADS = `
(function() {
  console.log('urnning things!');
  var tags = document.getElementsByTagName('script');
  for(var i = tags.length; i >= 0; i--) {
    if(tags[i] && tags[i].getAttribute('src') != null && tags[i].getAttribute('src').indexOf('https://www.googletagmanager.com/gtag/js?id=UA-148184993-1') > -1) {
      tags[i].parentNode.removeChild(tags[i]);
    }
  }
})();
`;

module.exports = {
  BACKGROUND,
  TRANS_LOGO,
  WHITE_LOGO,
  GRAY_LOGO,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  SPLASH,
  DISCORD_LINK,
  ABOUT,
  REMOVE_ADS,
  ISSUES_LINK
};