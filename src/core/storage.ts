export namespace LocalStorage {
    /*!
     * getObject: Read a value in JSON format from local storage.
     */
    export function get(key: string): any {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : data;
    };

    /*!
     * set: Write a pair of key/value to local storage.
     */
    export function set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    /*!
     * remove: Remove a pair of key/value from local storage.
     */
    export function remove(key: string) {
        localStorage.removeItem(key);
    };
}

export namespace SessionStorage {
    /*!
     * get: Read a value in JSON format from session storage.
     */
    export function get(key: string): any {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data): data;
    };

    /*!
     * set: Write a pair of key/value to session storage.
     */
    export function set(key: string, value: string | object) {
        sessionStorage.setItem(key, JSON.stringify(value));
    };

    /*!
     * remove: Remove a pair of key/value from session storage.
     */
    export function remove(key: string) {
        sessionStorage.removeItem(key);
    };
}
