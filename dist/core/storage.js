export var LocalStorage;
(function (LocalStorage) {
    /*!
     * getObject: Read a value in JSON format from local storage.
     */
    function get(key) {
        var data = localStorage.getItem(key);
        if (data === null) {
            return null;
        }
        return JSON.parse(data);
    }
    LocalStorage.get = get;
    ;
    /*!
     * set: Write a pair of key/value to local storage.
     */
    function set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    LocalStorage.set = set;
    ;
})(LocalStorage || (LocalStorage = {}));
export var SessionStorage;
(function (SessionStorage) {
    /*!
     * get: Read a value in JSON format from session storage.
     */
    function get(key) {
        var data = sessionStorage.getItem(key);
        if (data === null) {
            return null;
        }
        return JSON.parse(data);
    }
    SessionStorage.get = get;
    ;
    /*!
     * set: Write a pair of key/value to session storage.
     */
    function set(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
    SessionStorage.set = set;
    ;
})(SessionStorage || (SessionStorage = {}));
