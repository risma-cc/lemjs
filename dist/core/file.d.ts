export declare namespace AsyncFileReader {
    /*!
     * readAsArrayBuffer: Promise-based encapsulation of FileReader.readAsArrayBuffer.
     */
    function readAsArrayBuffer(file: Blob): Promise<ArrayBuffer>;
    /*!
     * readAsDataURL: Promise-based encapsulation of FileReader.readAsDataURL.
     */
    function readAsDataURL(file: Blob): Promise<string>;
    /*!
     * readAsText: Promise-based encapsulation of FileReader.readAsText.
     */
    function readAsText(file: Blob, encoding?: string): Promise<string>;
}
