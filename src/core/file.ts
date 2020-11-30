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