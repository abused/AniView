const themes = {
    DEFAULT: require('./../assets/themes/default.json'),
    TEST: require('./../assets/themes/test.json')
};

let theme = {};

function loadDefaultTheme() {
    parseTheme(themes.DEFAULT);
}

function parseTheme(json) {
    theme.name = json.name;
    theme.backgroundColor = json.backgroundColor;
    theme.navBackgroundColor = json.navBackgroundColor;
    theme.blueColor = json.blueColor;
    theme.redColor = json.redColor;
    theme.darkBlueColor = json.darkBlueColor;
    theme.placeholderColor = json.placeholderColor;
    theme.buttonTextColor = json.buttonTextColor;
    theme.textColor = json.textColor;
    theme.iconColor = json.iconColor;
    theme.iconActiveColor = json.iconActiveColor;
    theme.navTextColor = json.navTextColor;
    theme.navActiveTextColor = json.navActiveTextColor;
    theme.loginTopBorderColor = json.loginTopBorderColor;
    theme.buttonRightBorderColor = json.buttonRightBorderColor;
    module.exports.theme = theme;
}

module.exports = {
    themes: themes,
    theme: themes.DEFAULT,
    loadDefaultTheme: loadDefaultTheme,
    parseTheme: parseTheme
};