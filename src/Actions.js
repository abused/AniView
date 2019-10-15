import {AsyncStorage} from "react-native";
let Data = require('./Data');

function signIn() {
    console.log("Signed in!");
}

function skipSignIn() {
    console.log("Skipping sign in!");
}

async function storeData(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
    }catch (e) {
        console.log(e);
    }
}

async function retrieveData(key) {
    return await AsyncStorage.getItem(key);
}

async function loadData() {
    //let firstLoad = retrieveData()
    //Data.setFirstLoad()
}

module.exports = {
  signIn: signIn,
  skipSignIn: skipSignIn
};