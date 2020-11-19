export namespace LocalStorage {
    /*!
     * getObject: Read a value in JSON format from local storage.
     */
    export function get(key: string): any {
        const data = localStorage.getItem(key);
        if (data === null) {
            return null;
        }
        return JSON.parse(data);
    };

    /*!
     * set: Write a pair of key/value to local storage.
     */
    export function set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    };
}

export namespace SessionStorage {
    /*!
     * get: Read a value in JSON format from session storage.
     */
    export function get(key: string): any {
        const data = sessionStorage.getItem(key);
        if (data === null) {
            return null;
        }
        return JSON.parse(data);
    };

    /*!
     * set: Write a pair of key/value to session storage.
     */
    export function set(key: string, value: string | object) {
        sessionStorage.setItem(key, JSON.stringify(value));
    };
}
