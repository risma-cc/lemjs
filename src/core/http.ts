import {
    FormElement,
    HttpRequest,
    HttpAPI,
    HttpClient,
    HttpClientInit,
    HttpConfig,
    HttpParams,
    HttpRequestOptions
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
    let params = (typeof request.params == 'function') ? request.params() : request.params;
    if (params) {
        url += '?' + (new URLSearchParams(params)).toString();
    }
    let resp = await fetch(url, (typeof request.config == 'function') ? request.config() : request.config);

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
        let l = resp.headers.get('Location')
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
        config: { ...config, ...{ method: 'GET' } },
    });
}

/*!
 * httpPost: Send an HTTP POST request and return a response
 */
export async function httpPost(url: string, params?: HttpParams, config?: HttpConfig) {
    return await httpRequest({
        url: url,
        params: params,
        config: { ...config, ...{ method: 'POST' } },
    });
}

/*！
 * makeHttpClient: Create an HTTP client.
 */
export function makeHttpClient(init: HttpClientInit): HttpClient {
    return new HttpClientImpl(init);
}

class HttpClientImpl implements HttpClient {
    baseURL: string;
    defaultParams: HttpParams | (() => HttpParams);
    defaultConfig: HttpConfig | (() => HttpConfig);
    httpAPIs: Record<string, HttpAPI>;

    constructor(init: HttpClientInit) {
        this.baseURL = init.baseURL;
        this.defaultParams = init.defaultParams ? init.defaultParams : {};
        this.defaultConfig = init.defaultConfig ? init.defaultConfig : {};
        this.httpAPIs = init.httpAPIs;
    }

    async fetch(api: string, options?: HttpRequestOptions): Promise<any> {
        var httpAPI;
        try {
            httpAPI = this.httpAPIs[api];console.log(httpAPI)
        } catch(error) {
            return Promise.reject('The API \"' + api + '\" does NOT exist');
        }

        // Make a request object
        let request = {
            url: this.baseURL + (options?.url ? options.url : httpAPI.request.url),
            params: {
                ...(typeof this.defaultParams == 'function') ? this.defaultParams() : this.defaultParams,
                ...(typeof httpAPI.request.params == 'function') ? httpAPI.request.params() : httpAPI.request.params,
                ...(typeof options?.params == 'function') ? options?.params() : options?.params,
            },
            config: {
                ...(typeof this.defaultConfig == 'function') ? this.defaultConfig() : this.defaultConfig,
                ...(typeof httpAPI.request.config == 'function') ? httpAPI.request.config() : httpAPI.request.config,
                ...(typeof options?.config == 'function') ? options?.config() : options?.config,
            }
        };

        try {
            // In case of non-production env and mock enabled,
            // if a mock handler is defined, skips HTTP request and response
            if (process.env.NODE_ENV !== 'production' && process.env.MOCK_DISABLED !== 'true') {
                const mockHandler = httpAPI['mock'];
                if (mockHandler != undefined) {
                    return mockHandler(request);
                }
            }
            let data = await httpRequest(request);
            let responseHanlder = httpAPI['response'];
            if (responseHanlder) {
                data = await responseHanlder(data, request);
            }
            return data;
        } catch (error) {
            let errorHanlder = httpAPI['error'];
            if (errorHanlder) {
                await errorHanlder(error, request);
            }
            return Promise.reject(error);
        }
    }
}
