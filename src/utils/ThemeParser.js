const themes = {
    DARK: require('./../assets/themes/dark.json'),
    LIGHT: require('./../assets/themes/light.json'),
};

function loadTheme(theme) {
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

module.exports = {
    themes: themes,
    loadTheme: loadTheme,
    backgroundColor: themes.DARK.backgroundColor,
    navBackgroundColor: themes.DARK.navBackgroundColor,
    blueColor: themes.DARK.blueColor,
    redColor: themes.DARK.redColor,
    darkBlueColor: themes.DARK.darkBlueColor,
    placeholderColor: themes.DARK.placeholderColor,
    buttonTextColor: themes.DARK.buttonTextColor,
    textColor: themes.DARK.textColor,
    iconColor: themes.DARK.iconColor,
    navInactiveColor: themes.DARK.navInactiveColor,
    navActiveColor: themes.DARK.navActiveColor,
    borderColor: themes.DARK.borderColor,
    buttonRightBorderColor: themes.DARK.buttonRightBorderColor,
    boxShadowColor: themes.DARK.boxShadowColor,
    animeTitleBackgroundColor: themes.DARK.animeTitleBackgroundColor,
    textShadowColor: themes.DARK.textShadowColor
};