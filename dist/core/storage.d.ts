export declare namespace LocalStorage {
    /*!
     * getObject: Read a value in JSON format from local storage.
     */
    function get(key: string): any;
    /*!
     * set: Write a pair of key/value to local storage.
     */
    function set(key: string, value: any): void;
    /*!
     * remove: Remove a pair of key/value from local storage.
     */
    function remove(key: string): void;
}
export declare namespace SessionStorage {
    /*!
     * get: Read a value in JSON format from session storage.
     */
    function get(key: string): any;
    /*!
     * set: Write a pair of key/value to session storage.
     */
    function set(key: string, value: string | object): void;
    /*!
     * remove: Remove a pair of key/value from session storage.
     */
    function remove(key: string): void;
}
