export namespace LocalStorage {
    /*!
     * getString: Read a string from local storage.
     */
    export function getString(key: string): string | null {
        return localStorage.getItem(key);
    }

    /*!
     * getObject: Read an object with JSON format from local storage.
     */
    export function getObject(key: string): object | null {
        const data = localStorage.getItem(key);
        if (data === null) {
            return null;
        }
        return JSON.parse(data);
    };

    /*!
     * set: Write a pair of key/value to local storage.
     */
    export function set(key: string, value: string | object) {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    };
}

export namespace SessionStorage {
    /*!
     * getString: Read a string from session storage.
     */
    export function getString(key: string): string | null {
        return sessionStorage.getItem(key);
    }

    /*!
     * getObject: Read an object with JSON format from session storage.
     */
    export function getObject(key: string): object | null {
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
        sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    };
}

export namespace AsyncFileReader {
    /*!
     * readAsArrayBuffer: Promise-based encapsulation of FileReader.readAsArrayBuffer.
     */
    export async function readAsArrayBuffer(file: Blob): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader;
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                resolve(reader.result as ArrayBuffer);
            };
            reader.onloadend = () => {
                reject('FileReader failed');
            }
        });
    }

    /*!
     * readAsDataURL: Promise-based encapsulation of FileReader.readAsDataURL.
     */
    export async function readAsDataURL(file: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader;
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onloadend = () => {
                reject('FileReader failed');
            }
        });
    }

    /*!
     * readAsText: Promise-based encapsulation of FileReader.readAsText.
     */
    export async function readAsText(file: Blob, encoding?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader;
            reader.readAsText(file, encoding);
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onloadend = () => {
                reject('FileReader failed');
            }
        });
    }
}