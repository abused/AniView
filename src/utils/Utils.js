import React from "react";
import {Text} from "react-native";
import * as SecureStore from 'expo-secure-store/build/SecureStore';
const ThemeParser = require('./ThemeParser');

async function storeData(key, value) {
    try {
        if(SecureStore.getItemAsync(key) !== null) {
            await SecureStore.deleteItemAsync(key).then(val => SecureStore.setItemAsync(key, value));
        }else {
            await SecureStore.setItemAsync(key, value);
        }
    }catch (e) {
        console.log(e);
    }
}

async function retrieveData(key) {
    return await SecureStore.getItemAsync(key);
}

async function deleteData(key) {
    SecureStore.deleteItemAsync(key);
}

function secondsTimeFormat(seconds) {
    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600*24));
    let h = Math.floor(seconds % (3600*24) / 3600);
    let m = Math.floor(seconds % 3600 / 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";

    return (d > 0 ? dDisplay : '') + hDisplay + mDisplay;
}

function renderTruncatedFooter(handlePress) {
    return (
        <Text style={{color: ThemeParser.blueColor, marginTop: 5, marginBottom: 10}} onPress={handlePress}>
            Read more
        </Text>
    );
}

function renderRevealedFooter(handlePress) {
    return (
        <Text style={{color: ThemeParser.blueColor, marginTop: 5, marginBottom: 10}} onPress={handlePress}>
            Show less
        </Text>
    );
}

function getEpisode(title) {
    return title ? title.split(' - ')[0].replace('Episode ', '').replace(' ', '') : 0;
}

module.exports = {
    storeData: storeData,
    retrieveData: retrieveData,
    deleteData: deleteData,
    secondsTimeFormat: secondsTimeFormat,
    renderTruncatedFooter: renderTruncatedFooter,
    renderRevealedFooter: renderRevealedFooter,
    getEpisode: getEpisode
};