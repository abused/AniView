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
    theme.iconColor = json.iconColor;
    theme.textColor = json.textColor;
    theme.navInactiveColor = json.navInactiveColor;
    theme.navActiveColor = json.navActiveColor;
    theme.borderColor = json.borderColor;
    theme.buttonRightBorderColor = json.buttonRightBorderColor;

    return theme;
}

module.exports = {
    themes: themes,
    themeData: {
        theme: themes['DEFAULT'],
        loadTheme: function(json) {
            this.theme = json;
        }
    }
};