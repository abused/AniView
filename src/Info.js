import {Dimensions} from 'react-native';

const BACKGROUND = './assets/images/background.jpg';
const TRANS_LOGO = './assets/images/transparent_logo.png';
const WHITE_LOGO = './assets/images/white_logo.png';
const GRAY_LOGO = './assets/images/gray_logo.png';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

module.exports = {
  BACKGROUND: BACKGROUND,
  TRANS_LOGO: TRANS_LOGO,
  WHITE_LOGO: WHITE_LOGO,
  GRAY_LOGO: GRAY_LOGO,
  WINDOW_WIDTH: WINDOW_WIDTH,
  WINDOW_HEIGHT: WINDOW_HEIGHT
};