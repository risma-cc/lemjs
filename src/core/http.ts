import {
    FormElement,
    HttpRequest,
    HttpAPI,
    HttpClient,
    HttpClientInit,
    HttpConfig,
    HttpParams,
    HttpRequestOptions,
    RequestHandler,
    ResponseHandler,
    ErrorHandler,
} from '../index';

/*!
 * JsonBody: Converts an object to a JSON string
 */
export function JsonBody(data: object): string {
    return JSON.stringify(data);
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

/*！
 * makeHttpClient: Create an HTTP client.
 */
export function makeHttpClient(init: HttpClientInit): HttpClient {
    return new HttpClientImpl(init);
}

class HttpClientImpl implements HttpClient {
    httpAPIs: { [x: string]: HttpAPI };
    baseURL: string;
    defaultParams: HttpParams | (() => HttpParams);
    defaultConfig: HttpConfig | (() => HttpConfig);
    requestInterceptors?: RequestHandler[];
    responseInterceptors?: ResponseHandler[];
    errorInterceptors?: ErrorHandler[];

    constructor(init: HttpClientInit) {
        this.httpAPIs = init.httpAPIs;
        this.baseURL = init.baseURL ? init.baseURL : "";
        this.defaultParams = init.defaultParams ? init.defaultParams : {};
        this.defaultConfig = init.defaultConfig ? init.defaultConfig : {};
        this.requestInterceptors = init.requestInterceptors;
        this.responseInterceptors = init.responseInterceptors;
        this.errorInterceptors = init.errorInterceptors;
    }

    async fetch(api: string, options?: HttpRequestOptions): Promise<any> {
        var httpAPI;
        try {
            httpAPI = this.httpAPIs[api];
            if (!httpAPI) {
                return Promise.reject('The API \"' + api + '\" does NOT exist');
            }
        } catch(error) {
            return Promise.reject('The API \"' + api + '\" does NOT exist');
        }

        // Make a request object
        let request: HttpRequest = {
            url: this.baseURL + (options?.url ? options.url : httpAPI.url),
            params: {
                ...((typeof this.defaultParams == 'function') ? this.defaultParams() : this.defaultParams),
                ...((typeof httpAPI.params == 'function') ? httpAPI.params() : httpAPI.params),
                ...((typeof options?.params == 'function') ? options?.params() : options?.params),
            },
            config: {
                ...((typeof this.defaultConfig == 'function') ? this.defaultConfig() : this.defaultConfig),
                ...((typeof httpAPI.config == 'function') ? httpAPI.config() : httpAPI.config),
                ...((typeof options?.config == 'function') ? options?.config() : options?.config),
            }
        };

        try {
            if (this.requestInterceptors) {
                for (let handler of this.requestInterceptors) {
                    const req = await handler(request);
                    if (!req) {
                        return Promise.reject(await this.errorProc(httpAPI, request, 'The API \"' + api + '\" request was cancelled.'));
                    }
                    request = req;
                }
            }

            // In case of non-production env and mock enabled,
            // if a mock handler is defined, skips HTTP request.
            if (process.env.NODE_ENV !== 'production' && process.env.MOCK !== 'none') {
                const mockHandler = httpAPI['mock'];
                if (mockHandler != undefined) {
                    return await this.responseProc(httpAPI, request, mockHandler(request));
                }
            }
            let data = await httpRequest(request);
            return await this.responseProc(httpAPI, request, data);
        } catch (error) {
            return Promise.reject(await this.errorProc(httpAPI, request, error));
        }
    }

    private async responseProc(api: HttpAPI, request: HttpRequest, data: any) {
        try {
            this.responseInterceptors && this.responseInterceptors.forEach(async (handler) => {
                data = await handler(data, request);
            });
            const responseHanlder = api['response'];
            if (responseHanlder) {
                data = await responseHanlder(data, request);
            }
            return data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private async errorProc(api: HttpAPI, request: HttpRequest, error: any) {
        this.errorInterceptors && this.errorInterceptors.forEach(async (handler) => {
            error = await handler(error, request);
        });
        let errorHanlder = api['error'];
        if (errorHanlder) {
            error = await errorHanlder(error, request);
        }
        return error;
    }
}
