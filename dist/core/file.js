export var AsyncFileReader;
(function (AsyncFileReader) {
    /*!
     * readAsArrayBuffer: Promise-based encapsulation of FileReader.readAsArrayBuffer.
     */
    async function readAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader;
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onloadend = () => {
                reject('FileReader failed');
            };
        });
    }
    AsyncFileReader.readAsArrayBuffer = readAsArrayBuffer;
    /*!
     * readAsDataURL: Promise-based encapsulation of FileReader.readAsDataURL.
     */
    async function readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader;
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onloadend = () => {
                reject('FileReader failed');
            };
        });
    }
    AsyncFileReader.readAsDataURL = readAsDataURL;
    /*!
     * readAsText: Promise-based encapsulation of FileReader.readAsText.
     */
    async function readAsText(file, encoding) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader;
            reader.readAsText(file, encoding);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onloadend = () => {
                reject('FileReader failed');
            };
        });
    }
    AsyncFileReader.readAsText = readAsText;
})(AsyncFileReader || (AsyncFileReader = {}));
