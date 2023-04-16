const Store = require('electron-store');
const store = new Store();

function getKey(key) {
    return store.get(key);
}

function setKey(key, value) {
    return store.set(key, value);
}

export {getKey, setKey}