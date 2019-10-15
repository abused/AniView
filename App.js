import React from 'react';
import {View} from "react-native";
import Welcome from './src/Welcome';

export default class App extends React.Component {

    render() {
        return (
            <View>
                <Welcome/>
            </View>
        );
    }
}