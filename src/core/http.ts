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
export interface HttpClient extends HttpClientInit {
    httpAPIs: { [x: string]: HttpAPI },

    /*!
     * fetch: Asynchronous handler of the API request and response.
     * Request:
     *   URL: Join the base URL and a sub-path (fetch options‘ url has priority over HttpAPI's)
     *   Params: Combination of options' params, API's and client's default
     *   Config: Combination of options' config, API's and client's default 
     */
    fetch: (api: string, options?: HttpRequestOptions) => Promise<any>,
}

/*!
 * JsonBody: Converts an object to a JSON string
 */
export function JsonBody(value: any): string {
    return JSON.stringify(value);
}

/*!
 * FormBody: Converts elements to a FormData, e.g. file
 */
export function FormBody(elements: FormElement[]): FormData {
    let body = new FormData;
    elements.forEach(e => {
        if (typeof e.value == 'string') {
            body.append(e.name, e.value);
        } else {
            body.append(e.name, e.value, e.fileName);
        }
    });
    return body;
}

/*!
 * httpRequest: Send an HTTP request and return a response
 */
export async function httpRequest(request: HttpRequest) {
    let url = request.url;
    const params = new URLSearchParams((typeof request.params == 'function') ? request.params() : request.params);
    // Process URL path parameters
    const pathParams = url.match(/{(\S+)}/g);
    if (pathParams) {
        for (let p of pathParams) {
            let n = p.slice(1, -1)
            let v = params.get(n);
            if (v) {
                url = url.replace(p, v);
                params.delete(n);
            }
        }
    }
    // Process URL query parameters
    const queryParams = params.toString();
    if (queryParams.length > 0) {
        url += '?' + queryParams;
    }
    const resp = await fetch(url, (typeof request.config == 'function') ? request.config() : request.config);

    // Check HTTP status and parse response
    if (resp.status >= 200 && resp.status < 300) {
        const contentType = resp.headers.get('Content-Type');
        if (contentType != null) {
            if (contentType.indexOf('text') > -1) {
                return await resp.text();
            }
            if (contentType.indexOf('form') > -1) {
                return await resp.formData();
            }
            if (contentType.indexOf('json') > -1) {
                return await resp.json();
            }
            return await resp.blob();
        }
        return await resp.text();
    }
    if (resp.status === 301 || resp.status === 302) {   // Redirect
        const l = resp.headers.get('Location')
        window.location.assign(l == null ? '' : l);
    }
    return Promise.reject(resp.statusText);
}

/*!
 * httpGet: Send an HTTP GET request and return a response
 */
export async function httpGet(url: string, params?: HttpParams, config?: HttpConfig) {
    return await httpRequest({
        url: url,
        params: params,
        config: { ...config, method: 'GET' },
    });
}

/*!
 * httpPost: Send an HTTP POST request and return a response
 */
export async function httpPost(url: string, params?: HttpParams, config?: HttpConfig) {
    return await httpRequest({
        url: url,
        params: params,
        config: { ...config, method: 'POST' },
    });
}

/*!
 * httpPostJson: Send an HTTP POST request with JSON body and return a response
 */
export async function httpPostJson(url: string, params?: HttpParams, config?: HttpConfig) {
    return await httpRequest({
        url: url,
        params: params,
        config: {
            ...config,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        },
    });
}

/*!
 * httpClient: Class decorator for HTTP client
 */
export function httpClient(init: HttpClientInit) {
    return function <T extends {new(...args:any[]):{}}>(constructor: T) {
        return class extends constructor {
            static init = init;
        }
    }
}

type IHttpClient = PropertyDescriptor & { init: HttpClientInit };

/*!
 * httpClientGet: Method decorator for HTTP API with GET method
 */
export function httpClientGet(url: string) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        let method = descriptor.value;
        descriptor.value = async function () {
            let api: HttpAPI = {
                ...{ url: url },
                ...await method.apply(this, arguments)
            };
            return __request(api, {
                config: { method: 'GET' }
            }, (this as IHttpClient).init);
        }
    }
}

/*!
 * httpClientPost: Method decorator for HTTP API with POST method
 */
export function httpClientiPost(url: string) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        let method = descriptor.value;
        descriptor.value = async function () {
            let api: HttpAPI = {
                ...{ url: url },
                ...await method.apply(this, arguments)
            };
            return __request(api, {
                config: { method: 'POST' }
            }, (this as IHttpClient).init);
        }
    }
}

/*!
 * httpClientPostJson: Method decorator for HTTP API with POST method and JSON content type
 */
export function httpClientPostJson(url: string) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        let method = descriptor.value;
        descriptor.value = async function () {
            let api: HttpAPI = {
                ...{ url: url },
                ...await method.apply(this, arguments)
            };
            return __request(api, {
                config: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }
            }, (this as IHttpClient).init);
        }
    }
}

/*！
 * makeHttpClient: Create an HTTP client.
 */
export function makeHttpClient(init: HttpClientInit, apis: { [x: string]: HttpAPI }): HttpClient {
    return new HttpClientImpl(init, apis);
}

class HttpClientImpl implements HttpClient {
    httpAPIs: { [x: string]: HttpAPI };
    baseURL?: string;
    defaultParams?: HttpParams | (() => HttpParams);
    defaultConfig?: HttpConfig | (() => HttpConfig);
    requestInterceptors?: RequestHandler[];
    responseInterceptors?: (ResponseHandler | ResponseAsyncHandler)[];
    errorInterceptors?: (ErrorHandler | ErrorAsyncHandler)[];

    constructor(init: HttpClientInit, apis: { [x: string]: HttpAPI }) {
        this.httpAPIs = apis;
        this.baseURL = init.baseURL;
        this.defaultParams = init.defaultParams;
        this.defaultConfig = init.defaultConfig;
        this.requestInterceptors = init.requestInterceptors;
        this.responseInterceptors = init.responseInterceptors;
        this.errorInterceptors = init.errorInterceptors;
    }

    async fetch(api: string, options?: HttpRequestOptions): Promise<any> {
        let httpAPI = this.httpAPIs[api];
        if (!httpAPI) {
            return Promise.reject('The API \"' + api + '\" does NOT exist');
        }
        return __request(httpAPI, options, this)
    }
}

async function __response(api: HttpAPI, request: HttpRequest, data: any, init?: HttpClientInit) {
    if (init?.responseInterceptors) {
        for (let interceptor of init.responseInterceptors) {
            data = await interceptor(data, request);
        }
    }
    const respHanlder = api['response'];
    if (respHanlder) {
        data = await respHanlder(data, request);
    }
    return data;
}

async function __error(api: HttpAPI, request: HttpRequest, error: any, init?: HttpClientInit) {
    try {
        if (init?.errorInterceptors) {
            for (let interceptor of init.errorInterceptors) {
                error = await interceptor(error, request);
            }
        }
        const errorHanlder = api['error'];
        if (errorHanlder) {
            error = await errorHanlder(error, request);
        }
        return error;
    } catch {
        return error;
    }
}

async function __request(api: HttpAPI, options?: HttpRequestOptions, init?: HttpClientInit) {
    // Make a request object
    let request: HttpRequest = {
        url: init?.baseURL + (options?.url ? options.url : api.url),
        params: __merge(__merge(
            (typeof init?.defaultParams == 'function') ? init.defaultParams() : init?.defaultParams,
            (typeof api.params == 'function') ? api.params() : api.params
        ), (typeof options?.params == 'function') ? options.params() : options?.params),
        config: __merge(__merge(
            (typeof init?.defaultConfig == 'function') ? init.defaultConfig() : init?.defaultConfig,
            (typeof api.config == 'function') ? api.config() : api.config
        ), (typeof options?.config == 'function') ? options.config() : options?.config)
    };
    // let request: HttpRequest = {
    //     url: init?.baseURL + (options?.url ? options.url : api.url),
    //     params: {
    //         ...((typeof init?.defaultParams == 'function') ? init.defaultParams() : init?.defaultParams),
    //         ...((typeof api.params == 'function') ? api.params() : api.params),
    //         ...((typeof options?.params == 'function') ? options.params() : options?.params),
    //     },
    //     config: {
    //         ...((typeof init?.defaultConfig == 'function') ? init.defaultConfig() : init?.defaultConfig),
    //         ...((typeof api.config == 'function') ? api.config() : api.config),
    //         ...((typeof options?.config == 'function') ? options.config() : options?.config),
    //     }
    // };

    try {
        if (init?.requestInterceptors) {
            for (let interceptor of init.requestInterceptors) {
                const req = await interceptor(request);
                if (!req) {
                    return Promise.reject(await __error(api, request, 'The API \"' + api + '\" request was cancelled.', init));
                }
                request = req;
            }
        }

        // In case of non-production env and mock enabled,
        // if a mock handler is defined, skips HTTP request.
        if (process.env.NODE_ENV !== 'production' && process.env.MOCK !== 'none') {
            const mockHandler = api['mock'];
            if (mockHandler != undefined) {
                return await __response(api, request, mockHandler(request), init);
            }
        }
        let data = await httpRequest(request);
        return await __response(api, request, data, init);
    } catch (error) {
        return Promise.reject(await __error(api, request, error, init));
    }
}

function __merge(obj1: any, obj2: any) {
    if (!obj1) {
        return obj2;
    }
    if (!obj2) {
        return obj1;
    }
    for (let key in obj2) {
        // 如果target(也就是obj1[key])存在，且是对象的话再去调用merge，
        // 否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
        // 如果obj2[key]没有值或者值不是对象，此时直接替换obj1[key]
        let v1 = obj1[key];
        let v2 = obj2[key];
        obj1[key] = v1 && v1.toString() === "[object Object]" &&
            (v2 && v2.toString() === "[object Object]")
            ? __merge(v1, v2)
            : (obj1[key] = v2);
    }
    return obj1;
}