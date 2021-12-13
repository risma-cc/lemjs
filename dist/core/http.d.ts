/*!
 * HttpParams: Similar to URLSearchParams.
 */
export declare type HttpParams = {
    [x: string]: string;
};
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
export declare type RequestHandler = (request: HttpRequest) => (HttpRequest | false | Promise<HttpRequest | false>);
export declare type ResponseHandler = (response: any, request: HttpRequest) => any;
export declare type ResponseAsyncHandler = (response: any, request: HttpRequest) => Promise<any>;
export declare type ErrorHandler = (error: Error, request: HttpRequest) => any;
export declare type ErrorAsyncHandler = (error: Error, request: HttpRequest) => Promise<any>;
/*!
 * HttpAPI: Definition of HTTP API.
 */
export interface HttpAPI extends HttpRequest {
    /*!
     * response: Process response data and return them.
     */
    response?: ResponseHandler;
    /*!
     * error: Handles error.
     */
    error?: ErrorHandler;
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
    baseURL?: string;
    defaultParams?: HttpParams | (() => HttpParams);
    defaultConfig?: HttpConfig | (() => HttpConfig);
    requestInterceptors?: RequestHandler[];
    responseInterceptors?: (ResponseHandler | ResponseAsyncHandler)[];
    errorInterceptors?: (ErrorHandler | ErrorAsyncHandler)[];
}
/*!
 * HttpClient: The client for providing encapsulated HTTP APIs.
 */
export interface HttpClient extends HttpClientInit {
    httpAPIs: {
        [x: string]: HttpAPI;
    };
    /*!
     * fetch: Asynchronous handler of the API request and response.
     * Request:
     *   URL: Join the base URL and a sub-path (fetch options‘ url has priority over HttpAPI's)
     *   Params: Combination of options' params, API's and client's default
     *   Config: Combination of options' config, API's and client's default
     */
    fetch: (api: string, options?: HttpRequestOptions) => Promise<any>;
}
/*!
 * JsonBody: Converts an object to a JSON string
 */
export declare function JsonBody(value: any): string;
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
/*!
 * httpPostJson: Send an HTTP POST request with JSON body and return a response
 */
export declare function httpPostJson(url: string, params?: HttpParams, config?: HttpConfig): Promise<any>;
/*!
 * httpClient: Class decorator for HTTP client
 */
export declare function httpClient(init: HttpClientInit): <T extends new (...args: any[]) => {}>(constructor: T) => {
    new (...args: any[]): {};
    init: HttpClientInit;
} & T;
/*!
 * httpClientGet: Method decorator for HTTP API with GET method
 */
export declare function httpClientGet(url: string): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
/*!
 * httpClientPost: Method decorator for HTTP API with POST method
 */
export declare function httpClientiPost(url: string): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
/*!
 * httpClientPostJson: Method decorator for HTTP API with POST method and JSON content type
 */
export declare function httpClientPostJson(url: string): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
export declare function makeHttpClient(init: HttpClientInit, apis: {
    [x: string]: HttpAPI;
}): HttpClient;
