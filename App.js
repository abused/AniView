import React from 'react';
import {View, Text, Button} from "react-native";
import Welcome from './src/Welcome';
const Actions = require('./src/Actions');

export default class App extends React.Component {

    constructor(props) {
        super(props);
        let showWelcomeData;
        Actions.retrieveData('showWelcome').then(value => showWelcomeData = value);

        this.state = {
            showWelcome: showWelcomeData ? showWelcomeData === 'false' : true,
            loginScreen: false
        };

        this.updateWelcome = this.updateWelcome.bind(this);
    }

    updateWelcome(show, login) {
        if(!login) {
            Actions.storeData('showWelcome', show.toString());
            this.setState({showWelcome: show, loginScreen: login});
        }else {
            this.setState({loginScreen: login});
        }

        console.log(this.state.showWelcome);
        console.log(Actions.retrieveData('showWelcome'));
        console.log(this.state.loginScreen);
    }

    render() {
        if(this.state.showWelcome || this.state.loginScreen) {
            return (
                <View>
                    <Welcome updateWelcome={this.updateWelcome}/>
                </View>
            );
        }else {
            return (
                <View>
                    <Text>Hello World!</Text>
                    <Text>Hello World!</Text>
                    <Text>Hello World!</Text>
                    <Text>Hello World!</Text>
                    <Text>Hello World!</Text>
                    <Text>Hello World!</Text>
                    <Button title='Reset Everything!' onPress={() => this.updateWelcome(true, false)} />
                </View>
            );
        }
    }
}