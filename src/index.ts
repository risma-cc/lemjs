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
    query?: { [x: string]: (payload: any, state: T) => any };

    /*!
     * update: Defines functions of update actions whose returning values will be set to the state.
     */
    update?: { [x: string]: (payload: any, state: T) => T };
}

/*!
 * Model: The model for managing shared stateful data
 */
export interface Model<T> {
    /*!
     * getState: Returns the values of state
     */
    get: () => T;

    /*!
     * query: Dispatches a synchronous action to query the state.
     */
    query: (action: string, payload?: any) => any;

    /*!
     * update: Dispatches a synchronous action to update the state.
     */
    update: (action: string, payload?: any) => void;

    /*!
     * subscribe: Subscribes the update event.
     */
    subscribe: (callback: (state: T) => void) => void;

    /*!
     * unsubscribe: Unsubscribes the update event.
     */
    unsubscribe: (callback: (state: T) => void) => void;
}

export { makeModel } from './core/model';

/*!
 * HttpParams: Similar to URLSearchParams.
 */
export type HttpParams = { [x: string]: string };

/*!
 * HttpConfig: Configuration options of HTTP request.
 */
export type HttpConfig = RequestInit;

/*!
 * FormElement: Element in form data
 */
export interface FormElement {
    name: string,
    value: string | Blob,
    fileName?: string,
}

export { JsonBody, FormBody } from './core/http';

/*!
 * HttpRequest: HTTP rquest with a required url property.
 */
export interface HttpRequest {
    url: string,
    params?: HttpParams | (() => HttpParams),
    config?: HttpConfig | (() => HttpConfig),
}

/*!
 * HttpRequestOptions: HTTP request with all optional properties.
 */
export interface HttpRequestOptions {
    url?: string,
    params?: HttpParams | (() => HttpParams),
    config?: HttpConfig | (() => HttpConfig),
};

export { httpRequest, httpGet, httpPost } from './core/http';

export type RequestHandler = (request: HttpRequest) => (HttpRequest | false | Promise<HttpRequest | false>);
export type ResponseHandler = (response: any, request: HttpRequest) => any;
export type ResponseAsyncHandler = (response: any, request: HttpRequest) => Promise<any>;
export type ErrorHandler = (error: Error, request: HttpRequest) => any;
export type ErrorAsyncHandler = (error: Error, request: HttpRequest) => Promise<any>;

/*!
 * HttpAPI: Definition of HTTP API.
 */
export interface HttpAPI extends HttpRequest {
    /*!
     * response: Process response data and return them.
     */
    response?: ResponseHandler,

    /*!
     * error: Handles error.
     */
    error?: ErrorHandler,

    /*!
     * mock: If defines a mock handler, the API request will skip HTTP request and return the mock response.
     * When the environment variable NODE_ENV is "production" or MOCK is "none", it'll be ignored.
     */
    mock?: (request: HttpRequest) => any,
}

/*!
 * HttpClientInit: Definition of an HTTP APIs client for initialization.
 */
export interface HttpClientInit {
    httpAPIs: { [x: string]: HttpAPI },
    baseURL?: string,
    defaultParams?: HttpParams | (() => HttpParams),
    defaultConfig?: HttpConfig | (() => HttpConfig),
    requestInterceptors?: RequestHandler[],
    responseInterceptors?: (ResponseHandler | ResponseAsyncHandler)[],
    errorInterceptors?: (ErrorHandler | ErrorAsyncHandler)[],
}

/*!
 * HttpClient: The client for providing encapsulated HTTP APIs.
 */
export interface HttpClient {
    httpAPIs: { [x: string]: HttpAPI },
    baseURL: string,
    defaultParams: HttpParams | (() => HttpParams),
    defaultConfig: HttpConfig | (() => HttpConfig),
    requestInterceptors?: RequestHandler[],
    responseInterceptors?: (ResponseHandler | ResponseAsyncHandler)[],
    errorInterceptors?: (ErrorHandler | ErrorAsyncHandler)[],

    /*!
     * fetch: Asynchronous handler of the API request and response.
     * Request:
     *   URL: Join the base URL and a sub-path (fetch options‘ url has priority over HttpAPI's)
     *   Params: Combination of options' params, API's and client's default
     *   Config: Combination of options' config, API's and client's default 
     */
    fetch: (api: string, options?: HttpRequestOptions) => Promise<any>,
}

export { makeHttpClient } from './core/http';

export { AsyncFileReader } from './core/file';
export { LocalStorage, SessionStorage } from './core/storage';