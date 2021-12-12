export var LocalStorage;
(function (LocalStorage) {
    /*!
     * getObject: Read a value in JSON format from local storage.
     */
    function get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : data;
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
    /*!
     * remove: Remove a pair of key/value from local storage.
     */
    function remove(key) {
        localStorage.removeItem(key);
    }
    LocalStorage.remove = remove;
    ;
})(LocalStorage || (LocalStorage = {}));
export var SessionStorage;
(function (SessionStorage) {
    /*!
     * get: Read a value in JSON format from session storage.
     */
    function get(key) {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : data;
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
    /*!
     * remove: Remove a pair of key/value from session storage.
     */
    function remove(key) {
        sessionStorage.removeItem(key);
    }
    SessionStorage.remove = remove;
    ;
})(SessionStorage || (SessionStorage = {}));
