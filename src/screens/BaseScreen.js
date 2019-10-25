import React from 'react';
import NetInfo from '@react-native-community/netinfo';

const AniListAuth = require('../utils/AniListAuth');

export default class BaseScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isConnected: true
        };
    }

    componentDidMount() {
        NetInfo.addEventListener('connectionChange', state => this.setState({isConnected: state}));
        AniListAuth.getMostPopularAnime();
    }

    componentWillUnmount() {
        NetInfo.removeEventListener('connectionChange', state => this.setState({isConnected: state}));
    }
}