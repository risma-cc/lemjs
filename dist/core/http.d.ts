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
/*!
 * HttpRequest: HTTP rquest with a required url property.
 */
export interface HttpRequest {
    url: string;
    params?: HttpParams | (() => HttpParams | undefined);
    config?: HttpConfig | (() => HttpConfig | undefined);
}
/*!
 * jsonBody: Converts an object to an JSON string
 */
export declare function jsonBody(value: any): string;
/*!
 * formBody: Converts elements to a FormData, e.g. file
 */
export declare function formBody(elements: FormElement[]): FormData;
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
 * HttpRequestController: HTTP rquest with abort controller
 */
export declare class HttpRequestController implements HttpRequest {
    url: string;
    params: HttpParams | (() => HttpParams | undefined) | undefined;
    config: HttpConfig | (() => HttpConfig | undefined);
    private controller;
    constructor(req: HttpRequest);
    abort(): void;
}
/*!
 * HttpRequestHanlders: Definition of HTTP request handlers.
 */
export declare type RequestHandler = (request: HttpRequest) => boolean;
export declare type ResponseHandler = ((data: any, request: HttpRequest) => any) | ((data: any, request: HttpRequest) => Promise<any>);
export declare type ErrorHandler = ((error: any, request: HttpRequest) => any) | ((error: any, request: HttpRequest) => Promise<any>);
export interface HttpRequestHanlders {
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
 * HttpClientRequest: Definition of HTTP client request.
 */
export declare class HttpClientRequest extends HttpRequestController implements HttpRequestHanlders {
    client: HttpClient;
    response?: ResponseHandler;
    error?: ErrorHandler;
    mock?: (request: HttpRequest) => any;
    constructor(client: HttpClient, request: HttpRequest, handlers?: HttpRequestHanlders);
    send(): Promise<any>;
    private __response;
    private __error;
}
/*!
 * HttpClient: Definition of an HTTP client.
 */
export interface HttpClient {
    baseURL?: string;
    defaultParams?: HttpParams | (() => HttpParams | undefined);
    defaultConfig?: HttpConfig | (() => HttpConfig | undefined);
    requestInterceptor?: RequestHandler;
    responseInterceptor?: ResponseHandler;
    errorInterceptor?: ErrorHandler;
}
export declare function httpClientGet(client: HttpClient, request: HttpRequest, handlers?: HttpRequestHanlders): HttpClientRequest;
export declare function httpClientPost(client: HttpClient, request: HttpRequest, handlers?: HttpRequestHanlders): HttpClientRequest;
export declare function httpClientPostJson(client: HttpClient, request: HttpRequest, handlers?: HttpRequestHanlders): HttpClientRequest;
export declare function httpClientRequest(client: HttpClient, request: HttpRequest, config?: HttpConfig, handlers?: HttpRequestHanlders): HttpClientRequest;
