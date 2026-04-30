import * as SecureStore from "expo-secure-store"

async function secureSave(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

async function secureGet(key: string) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        console.log(result);
    } else {
        console.log('No values stored under that key.');
    }
}

export {
    secureGet, secureSave
}; 