/*!
 * ModelInit: Definition of model for initialization
 */
export interface ModelInit<T> {
    /*!
     * state: Initial values of the state
     */
    state: T;
    /*!
     * query: Involves functions of query actions.
     */
    query: Record<symbol | string, (payload: {}, state: T) => any>;
    /*!
     * update: Involves functions of update actions whose returning values will be set to the state.
     */
    update: Record<symbol | string, (payload: {}, state: T) => T>;
    /*!
     * put: Involves functions of asynchronous actions.
     */
    put: Record<symbol | string, (payload: {}, state: T) => Promise<void>>;
}
/*!
 * Model: The model for managing shared stateful data
 */
export interface Model<T> {
    /*!
     * state: The stateful values
     */
    state: T;
    /*!
     * query: Dispatches a synchronous action to query the state.
     */
    query: (action: string, payload: any) => any;
    /*!
     * update: Dispatches a synchronous action to update the state.
     */
    update: (action: string, payload: any) => T;
    /*!
     * put: Dispatches an asynchronous action.
     */
    put: (action: string, payload: any) => Promise<void>;
    /*!
     * subscribe: Subscribes the update event.
     */
    subscribeUpdate: (callback: (state: T) => void) => void;
    /*!
     * unsubscribe: Unsubscribes the update event.
     */
    unsubscribeUpdate: (callback: (state: T) => void) => void;
    /*!
     * subscribe: Subscribes the loading event including on and off.
     */
    subscribeLoading: (callback: (on: boolean, action: string) => void) => void;
    /*!
     * unsubscribe: Unsubscribes the loading event.
     */
    unsubscribeLoading: (callback: (on: boolean, action: string) => void) => void;
}
export { makeModel } from './core/model';
/*!
 * HttpParams: similar to URLSearchParams.
 */
export declare type HttpParams = Record<string, string>;
/*!
 * HttpConfig: configuration options of HTTP request.
 */
export interface HttpConfig extends RequestInit {
}
/*!
 * HttpRequest: HTTP rquest with a required url property.
 */
export interface HttpRequest {
    url: string;
    params?: HttpParams;
    config?: HttpConfig;
}
/*!
 * HttpRequestOptions: HTTP request with all optional properties.
 */
export interface HttpRequestOptions {
    url?: string;
    params?: HttpParams;
    config?: HttpConfig;
}
/*!
 * HttpClient: An encapsulation of HTTP fetch.
 */
export interface HttpClient {
    /*!
     * config: Configuration of HTTP client.
     */
    config: HttpConfig;
    /*!
     * setHeader: Set one of HTTP reqest header.
     */
    setHeader: (name: string, value: string) => void;
    /*!
     * deleteHeader: Delete one of HTTP request header.
     */
    deleteHeader: (name: string) => void;
    /*!
     * request: Fetches an HTTP request.
     */
    request: (request: HttpRequest) => Promise<any>;
    /*!
     * get: Fetches an HTTP GET request.
     */
    get: (path: string, params?: HttpParams, config?: HttpConfig) => Promise<any>;
    /*!
     * post: Fetches an HTTP POST request.
     */
    post: (path: string, params?: HttpParams, config?: HttpConfig) => Promise<any>;
}
export { makeHttpClient, getHttpClient } from './core/http';
/*!
 * HttpAPI: Definition of HTTP API.
 */
export interface HttpAPI {
    request: HttpRequest;
    response: (response: any, service: HttpService) => any;
    error?: (error: Error, service: HttpService) => any;
    /*!
     * mock: If defines a mock handler, the API request will skip HTTP request and return the mock value.
     */
    mock?: (request: HttpRequest) => any;
}
/*!
 * HttpServiceInit: Definition of HTTP service for initialization.
 */
export interface HttpServiceInit {
    baseURL: string;
    defaultParams?: HttpParams;
    defaultConfig?: HttpConfig;
    httpAPIs: Record<string, HttpAPI>;
    httpClient?: HttpClient;
}
/*!
 * HttpService: The HTTP service for providing encapsulated APIs.
 */
export interface HttpService {
    baseURL: string;
    defaultParams: HttpParams;
    defaultConfig: HttpConfig;
    httpAPIs: Record<string, HttpAPI>;
    httpClient: HttpClient;
    /*!
     * fetch: Asynchronous handler of the API request and response.
     * URL: The service's base URL + fetch options' url (path actually) / API's
     * Params: Combination of options' params, API's and service's default
     * Config: Combination of options' config, API's, services' default and HttpClient's
     */
    fetch: (api: string, options?: HttpRequestOptions) => Promise<any>;
}
export { makeHttpService, enableMock } from './core/service';
