export var LocalStorage;
(function (LocalStorage) {
    /*!
     * getString: Read a string from local storage.
     */
    function getString(key) {
        return localStorage.getItem(key);
    }
    LocalStorage.getString = getString;
    /*!
     * getObject: Read an object with JSON format from local storage.
     */
    function getObject(key) {
        var data = localStorage.getItem(key);
        if (data === null) {
            return null;
        }
        return JSON.parse(data);
    }
    LocalStorage.getObject = getObject;
    ;
    /*!
     * set: Write a pair of key/value to local storage.
     */
    function set(key, value) {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
    LocalStorage.set = set;
    ;
})(LocalStorage || (LocalStorage = {}));
export var SessionStorage;
(function (SessionStorage) {
    /*!
     * getString: Read a string from session storage.
     */
    function getString(key) {
        return sessionStorage.getItem(key);
    }
    SessionStorage.getString = getString;
    /*!
     * getObject: Read an object with JSON format from session storage.
     */
    function getObject(key) {
        var data = sessionStorage.getItem(key);
        if (data === null) {
            return null;
        }
        return JSON.parse(data);
    }
    SessionStorage.getObject = getObject;
    ;
    /*!
     * set: Write a pair of key/value to session storage.
     */
    function set(key, value) {
        sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
    SessionStorage.set = set;
    ;
})(SessionStorage || (SessionStorage = {}));
