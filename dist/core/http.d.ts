import { FormElement, HttpRequest, HttpClient, HttpClientInit, HttpConfig, HttpParams } from '../index';
/*!
 * JsonBody: Converts an object to a JSON string
 */
export declare function JsonBody(data: object): string;
/*!
 * FormBody: Converts elements to a FormData, e.g. file
 */
export declare function FormBody(elements: FormElement[]): FormData;
/*!
 * httpRequest: Send an HTTP request and return a response
 */
export declare function httpRequest(request: HttpRequest): Promise<any>;
/*!
 * httpGet: Send an HTTP GET request and return a response
 */
export declare function httpGet(url: string, params?: HttpParams, config?: HttpConfig): Promise<any>;
/*!
 * httpPost: Send an HTTP POST request and return a response
 */
export declare function httpPost(url: string, params?: HttpParams, config?: HttpConfig): Promise<any>;
export declare let enableMock: boolean;
export declare function makeHttpClient(init: HttpClientInit): HttpClient;
