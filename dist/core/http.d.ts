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
export declare type ResponseHandler = (response: any, request: HttpRequest) => (any | Promise<any>);
export declare type ErrorHandler = (error: Error, request: HttpRequest) => (Error | Promise<Error>);
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
 * HttpClient: Definition of an HTTP client.
 */
export interface HttpClient {
    baseURL?: string;
    defaultParams?: HttpParams | (() => HttpParams);
    defaultConfig?: HttpConfig | (() => HttpConfig);
    requestInterceptors?: RequestHandler[];
    responseInterceptors?: ResponseHandler[];
    errorInterceptors?: ErrorHandler[];
}
/*!
 * HttpAPI: Definition of an HTTP API.
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
export declare function httpClientGet(client: HttpClient, api: HttpAPI): Promise<any>;
export declare function httpClientPost(client: HttpClient, api: HttpAPI): Promise<any>;
export declare function httpClientPostJson(client: HttpClient, api: HttpAPI): Promise<any>;
