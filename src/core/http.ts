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

export type RequestHandler = (request: HttpRequest) => (HttpRequest | false | Promise<HttpRequest | false>);
export type ResponseHandler = (response: any, request: HttpRequest) => (any | Promise<any>);
export type ErrorHandler = (error: Error, request: HttpRequest) => (Error | Promise<Error>);

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
    // Config
    let config = (typeof request.config == 'function') ? request.config() : request.config;
    const resp = await fetch(url, config);

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
    return Promise.reject(Error(resp.statusText));
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
        config: __mergeConfig(config, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }),
    });
}

/*!
 * HttpRequestController: HTTP rquest with abort controller
 */
export class HttpRequestController implements HttpRequest {
    url: string;
    params: HttpParams | (() => HttpParams) | undefined;
    config: HttpConfig | (() => HttpConfig);
    controller = new AbortController();

    constructor(req: HttpRequest) {
        this.url = req.url;
        this.params = req.params;
        if (typeof req.config === 'function') {
            const configProc = req.config;
            const signal = this.controller.signal;
            this.config = () => {
                return { ...configProc(), signal: signal };
            }
        } else {
            this.config = { ...req.config, signal: this.controller.signal };
        }
    }

    abort() {
        this.controller.abort();
    }
}


/*!
 * HttpClient: Definition of an HTTP client.
 */
export interface HttpClient {
    baseURL?: string,
    defaultParams?: HttpParams | (() => HttpParams),
    defaultConfig?: HttpConfig | (() => HttpConfig),
    requestInterceptors?: RequestHandler[],
    responseInterceptors?: ResponseHandler[],
    errorInterceptors?: ErrorHandler[],
}

/*!
 * HttpAPI: Definition of an HTTP API.
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

export async function httpClientGet(client: HttpClient, api: HttpAPI) {
    return __request(client, api, { method: 'GET' });
}

export async function httpClientPost(client: HttpClient, api: HttpAPI) {
    return __request(client, api, { method: 'POST' });
}

export async function httpClientPostJson(client: HttpClient, api: HttpAPI) {
    return __request(client, api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
}

async function __request(client: HttpClient, api: HttpAPI, config: HttpConfig) {
    // Make a request object
    let request: HttpRequest = {
        url: client.baseURL + api.url,
        params: {
            ...(typeof client.defaultParams === 'function') ? client.defaultParams() : client.defaultParams,
            ...(typeof api.params === 'function') ? api.params() : api.params
        },
        config: __mergeConfig(__mergeConfig(
            (typeof client.defaultConfig == 'function') ? client.defaultConfig() : client.defaultConfig,
            (typeof api.config === 'function') ? api.config() : api.config
        ), config)
    }

    try {
        if (client.requestInterceptors) {
            for (let interceptor of client.requestInterceptors) {
                const req = await interceptor(request);
                if (!req) {
                    return Promise.reject(await __error(client, request, Error('The request \"' + api.url + '\" was cancelled.'), api.error));
                }
                request = req;
            }
        }

        // In case of non-production env and mock enabled,
        // if a mock handler is defined, skips HTTP request.
        if (process.env.NODE_ENV !== 'production' && process.env.MOCK !== 'none') {
            if (api.mock) {
                return await __response(client, request, api.mock, api.response);
            }
        }
        let data = await httpRequest(request);
        return await __response(client, request, data, api.response);
    } catch (error: any) {
        return Promise.reject(await __error(client, request, error, api.error));
    }
}

async function __response(
    client: HttpClient,
    request: HttpRequest,
    data: any,
    responseHandler?: ResponseHandler
) {
    if (client.responseInterceptors) {
        for (let interceptor of client.responseInterceptors) {
            data = await interceptor(data, request);
        }
    }
    return responseHandler ? await responseHandler(data, request) : data;
}

async function __error(
    client: HttpClient,
    request: HttpRequest,
    error: Error,
    errorHandler?: ErrorHandler
) {
    try {
        if (client.errorInterceptors) {
            for (let interceptor of client.errorInterceptors) {
                error = await interceptor(error, request);
            }
        }
        return errorHandler ? await errorHandler(error, request) : error;
    } catch (err) {
        return err;
    }
}

function __mergeConfig(cfg1: HttpConfig | undefined, cfg2: HttpConfig | undefined) {
    if (!cfg2) {
        return cfg1;
    }
    if (!cfg1) {
        return cfg2;
    }
    const { headers: h1, ...c1 } = cfg1;
    const { headers: h2, ...c2 } = cfg2;
    return {
        ...c1, ...c2,
        headers: { ...h1, ...h2 }
    } as HttpConfig;
}