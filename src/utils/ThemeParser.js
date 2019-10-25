//TODO PARSE THEMES FROM GITHUB REPO SO THAT THEY CAN BE EDITED EASILY!
const themes = {
    'DEFAULT': require('./../assets/themes/default.json'),
    'TEST': require('./../assets/themes/test.json')
};

function parseTheme(json) {
    module.exports.themeData.theme.name = json.name;
    module.exports.themeData.theme.backgroundColor = json.backgroundColor;
    module.exports.themeData.theme.navBackgroundColor = json.navBackgroundColor;
    module.exports.themeData.theme.blueColor = json.blueColor;
    module.exports.themeData.theme.redColor = json.redColor;
    module.exports.themeData.theme.darkBlueColor = json.darkBlueColor;
    module.exports.themeData.theme.placeholderColor = json.placeholderColor;
    module.exports.themeData.theme.buttonTextColor = json.buttonTextColor;
    module.exports.themeData.theme.iconColor = json.iconColor;
    module.exports.themeData.theme.textColor = json.textColor;
    module.exports.themeData.theme.navInactiveColor = json.navInactiveColor;
    module.exports.themeData.theme.navActiveColor = json.navActiveColor;
    module.exports.themeData.theme.borderColor = json.borderColor;
    module.exports.themeData.theme.buttonRightBorderColor = json.buttonRightBorderColor;
}

module.exports = {
    themes: themes,
    themeData: {
        theme: themes['DEFAULT'],
        loadTheme: function(json) {
            parseTheme(json);
        }
    }
};