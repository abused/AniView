const themes = {
    DEFAULT: require('./../assets/themes/default.json'),
};

function loadTheme(theme) {
    module.exports.name = theme.name;
    module.exports.backgroundColor = theme.backgroundColor;
    module.exports.navBackgroundColor = theme.navBackgroundColor;
    module.exports.blueColor = theme.blueColor;
    module.exports.redColor = theme.redColor;
    module.exports.darkBlueColor = theme.darkBlueColor;
    module.exports.placeholderColor = theme.placeholderColor;
    module.exports.buttonTextColor = theme.buttonTextColor;
    module.exports.textColor = theme.textColor;
    module.exports.iconColor = theme.iconColor;
    module.exports.navInactiveColor = theme.navInactiveColor;
    module.exports.navActiveColor = theme.navActiveColor;
    module.exports.borderColor = theme.borderColor;
    module.exports.buttonRightBorderColor = theme.buttonRightBorderColor;
    module.exports.boxShadowColor = theme.boxShadowColor;
    module.exports.animeTitleBackgroundColor = theme.animeTitleBackgroundColor;
    module.exports.textShadowColor = theme.textShadowColor;
}

loadTheme(themes.DEFAULT);
module.exports = {
    themes: themes,
    loadTheme: loadTheme,
    backgroundColor: themes.DEFAULT.backgroundColor,
    navBackgroundColor: themes.DEFAULT.navBackgroundColor,
    blueColor: themes.DEFAULT.blueColor,
    redColor: themes.DEFAULT.redColor,
    darkBlueColor: themes.DEFAULT.darkBlueColor,
    placeholderColor: themes.DEFAULT.placeholderColor,
    buttonTextColor: themes.DEFAULT.buttonTextColor,
    textColor: themes.DEFAULT.textColor,
    iconColor: themes.DEFAULT.iconColor,
    navInactiveColor: themes.DEFAULT.navInactiveColor,
    navActiveColor: themes.DEFAULT.navActiveColor,
    borderColor: themes.DEFAULT.borderColor,
    buttonRightBorderColor: themes.DEFAULT.buttonRightBorderColor,
    boxShadowColor: themes.DEFAULT.boxShadowColor,
    animeTitleBackgroundColor: themes.DEFAULT.animeTitleBackgroundColor,
    textShadowColor: themes.DEFAULT.textShadowColor
};