import React from 'react';
import {SafeAreaView, Text} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ThemeParser = require('./../utils/ThemeParser');
const GlobalStyles = require('./../assets/styles/GlobalStyles');

export default class DownloadsScreen extends React.Component {
    static navigationOptions = {
        title: <Text style={GlobalStyles.globalStyles.headerText}>Downloads</Text>,
        headerStyle: GlobalStyles.globalStyles.header
    };

    render() {
        return(
            <SafeAreaView style={[GlobalStyles.globalStyles.safeContainer, {backgroundColor: ThemeParser.backgroundColor, justifyContent: 'center', alignItems: 'center'}]}>
                <FontAwesome color={ThemeParser.textColor} size={40} name='archive' />
                <Text style={{color: ThemeParser.textColor, fontSize: 30}}>Coming Soon!</Text>
            </SafeAreaView>
        );
    }
}