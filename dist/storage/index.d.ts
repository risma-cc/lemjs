export declare namespace LocalStorage {
    /*!
     * getString: Read a string from local storage.
     */
    function getString(key: string): string | null;
    /*!
     * getObject: Read an object with JSON format from local storage.
     */
    function getObject(key: string): object | null;
    /*!
     * set: Write a pair of key/value to local storage.
     */
    function set(key: string, value: string | object): void;
}
export declare namespace SessionStorage {
    /*!
     * getString: Read a string from session storage.
     */
    function getString(key: string): string | null;
    /*!
     * getObject: Read an object with JSON format from session storage.
     */
    function getObject(key: string): object | null;
    /*!
     * set: Write a pair of key/value to session storage.
     */
    function set(key: string, value: string | object): void;
}
