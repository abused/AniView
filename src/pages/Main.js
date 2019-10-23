import React from 'react';
import {View, Text} from "react-native";

const styles = require('../assets/styles/MainStyles');
const global = require('../assets/styles/GlobalStyles');
const Utils = require('../utils/Utils');
const Info = require('../utils/Info');
const ThemeParser = require('../utils/ThemeParser');

class HomeScreen extends React.Component {

    render() {
        return(
            <View style={[global.globalStyles.container, {backgroundColor: ThemeParser.themeData.theme.backgroundColor}]}>
                <Text h1>Hello World</Text>
            </View>
        );
    }
}

module.exports = {
    HomeScreen: HomeScreen
};