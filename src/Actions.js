import * as SecureStore from 'expo-secure-store';

async function storeData(key, value) {
    try {
        if(SecureStore.getItemAsync(key) !== null) {
            await SecureStore.deleteItemAsync(key).then(fulfilledVal => SecureStore.setItemAsync(key, value));
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

module.exports = {
    storeData: storeData,
    retrieveData: retrieveData
};