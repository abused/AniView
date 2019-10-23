//TODO PARSE THEMES FROM GITHUB REPO SO THAT THEY CAN BE EDITED EASILY!
const themes = {
    'DEFAULT': require('./../assets/themes/default.json'),
    'TEST': require('./../assets/themes/test.json')
};

function parseTheme(json) {
    let theme = {};

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

    return theme;
}

module.exports = {
    themes: themes,
    themeData: {
        theme: parseTheme(themes['DEFAULT']),
        loadTheme: function(json) {
            this.theme = parseTheme(json);
        }
    }
};