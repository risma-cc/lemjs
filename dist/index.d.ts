/*!
 * ModelInit: Definition of model for initialization
 */
export interface ModelInit<T> {
    /*!
     * state: Initial values of the state
     */
    state: T;
    /*!
     * query: Defines functions of query actions.
     */
    query?: Record<symbol | string, (payload: {}, state: T) => any>;
    /*!
     * update: Defines functions of update actions whose returning values will be set to the state.
     */
    update?: Record<symbol | string, (payload: {}, state: T) => T>;
}
/*!
 * Model: The model for managing shared stateful data
 */
export interface Model<T> {
    /*!
     * getState: Returns the values of state
     */
    getState: () => T;
    /*!
     * query: Dispatches a synchronous action to query the state.
     */
    query: (action: string, payload: any) => any;
    /*!
     * update: Dispatches a synchronous action to update the state.
     */
    update: (action: string, payload: any) => T;
    /*!
     * subscribe: Subscribes the update event.
     */
    subscribe: (callback: (state: T) => void) => void;
    /*!
     * unsubscribe: Unsubscribes the update event.
     */
    unsubscribe: (callback: (state: T) => void) => void;
}
export { makeModel, useModel } from './core/model';
/*!
 * HttpParams: Similar to URLSearchParams.
 */
export declare type HttpParams = Record<string, string>;
/*!
 * HttpConfig: Configuration options of HTTP request.
 */
export declare type HttpConfig = RequestInit;
/*!
 * FormElement: Element in form data
 */
export interface FormElement {
    name: string;
    value: string | Blob;
    fileName?: string;
}
export { JsonBody, FormBody } from './core/http';
/*!
 * HttpRequest: HTTP rquest with a required url property.
 */
export interface HttpRequest {
    url: string;
    params?: HttpParams | (() => HttpParams);
    config?: HttpConfig | (() => HttpConfig);
}
/*!
 * HttpRequestOptions: HTTP request with all optional properties.
 */
export interface HttpRequestOptions {
    url?: string;
    params?: HttpParams | (() => HttpParams);
    config?: HttpConfig | (() => HttpConfig);
}
export { httpRequest, httpGet, httpPost } from './core/http';
/*!
 * HttpAPI: Definition of HTTP API.
 */
export interface HttpAPI extends HttpRequest {
    /*!
     * response: Process response data and return them.
     */
    response?: (response: any, request: HttpRequest) => any;
    /*!
     * error: Handles error.
     */
    error?: (error: Error, request: HttpRequest) => any;
    /*!
     * mock: If defines a mock handler, the API request will skip HTTP request and return the mock response.
     * When the environment variable NODE_ENV is "production" or MOCK is "none", it'll be ignored.
     */
    mock?: (request: HttpRequest) => any;
}
/*!
 * HttpClientInit: Definition of an HTTP APIs client for initialization.
 */
export interface HttpClientInit {
    httpAPIs: Record<string, HttpAPI>;
    baseURL?: string;
    defaultParams?: HttpParams | (() => HttpParams);
    defaultConfig?: HttpConfig | (() => HttpConfig);
    defaultResponse?: (response: any, request: HttpRequest) => any;
    defaultError?: (error: Error, request: HttpRequest) => any;
}
/*!
 * HttpClient: The client for providing encapsulated HTTP APIs.
 */
export interface HttpClient {
    httpAPIs: Record<string, HttpAPI>;
    baseURL: string;
    defaultParams: HttpParams | (() => HttpParams);
    defaultConfig: HttpConfig | (() => HttpConfig);
    defaultResponse?: (response: any, request: HttpRequest) => any;
    defaultError?: (error: Error, request: HttpRequest) => any;
    /*!
     * fetch: Asynchronous handler of the API request and response.
     * Request:
     *   URL: Join the base URL and a sub-path (fetch options‘ url has priority over HttpAPI's)
     *   Params: Combination of options' params, API's and client's default
     *   Config: Combination of options' config, API's and client's default
     */
    fetch: (api: string, options?: HttpRequestOptions) => Promise<any>;
}
export { makeHttpClient } from './core/http';
export { AsyncFileReader } from './core/file';
export { LocalStorage, SessionStorage } from './core/storage';
