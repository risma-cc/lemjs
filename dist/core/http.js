import 'reflect-metadata';
;
/*!
 * JsonBody: Converts an object to a JSON string
 */
export function JsonBody(value) {
    return JSON.stringify(value);
}
/*!
 * FormBody: Converts elements to a FormData, e.g. file
 */
export function FormBody(elements) {
    let body = new FormData;
    elements.forEach(e => {
        if (typeof e.value == 'string') {
            body.append(e.name, e.value);
        }
        else {
            body.append(e.name, e.value, e.fileName);
        }
    });
    return body;
}
/*!
 * httpRequest: Send an HTTP request and return a response
 */
export async function httpRequest(request) {
    let url = request.url;
    const params = new URLSearchParams((typeof request.params == 'function') ? request.params() : request.params);
    // Process URL path parameters
    const pathParams = url.match(/{(\S+)}/g);
    if (pathParams) {
        for (let p of pathParams) {
            let n = p.slice(1, -1);
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
    if (resp.status === 301 || resp.status === 302) { // Redirect
        const l = resp.headers.get('Location');
        window.location.assign(l == null ? '' : l);
    }
    return Promise.reject(resp.statusText);
}
/*!
 * httpGet: Send an HTTP GET request and return a response
 */
export async function httpGet(url, params, config) {
    return await httpRequest({
        url: url,
        params: params,
        config: { ...config, method: 'GET' },
    });
}
/*!
 * httpPost: Send an HTTP POST request and return a response
 */
export async function httpPost(url, params, config) {
    return await httpRequest({
        url: url,
        params: params,
        config: { ...config, method: 'POST' },
    });
}
/*!
 * httpPostJson: Send an HTTP POST request with JSON body and return a response
 */
export async function httpPostJson(url, params, config) {
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
export function httpClient(init) {
    return function (constructor) {
        return class extends constructor {
            static init = init;
        };
    };
}
/*!
 * httpClientGet: Method decorator for HTTP API with GET method
 */
export function httpClientGet(url, params, config) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        if (!method)
            return;
        const metadata = Reflect.getMetadata(propertyKey, target);
        descriptor.value = async function (...args) {
            return __request({
                url: url,
                params: (typeof params === 'function') ? params(args) : params,
                config: config,
                response: await method.apply(this, args),
                error: metadata && metadata.error,
                mock: metadata && (() => metadata.mock)
            }, {
                config: { method: 'GET' }
            }, this.init);
        };
    };
}
/*!
 * httpClientPost: Method decorator for HTTP API with POST method
 */
export function httpClientPost(url, params, config) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        if (!method)
            return;
        const metadata = Reflect.getMetadata(propertyKey, target);
        descriptor.value = async function (...args) {
            return __request({
                url: url,
                params: (typeof params === 'function') ? params(args) : params,
                config: config,
                response: await method.apply(this, args),
                error: metadata && metadata.error,
                mock: metadata && (() => metadata.mock)
            }, {
                config: { method: 'POST' }
            }, this.init);
        };
    };
}
/*!
 * httpClientPostJson: Method decorator for HTTP API with POST method and JSON content type
 */
export function httpClientPostJson(url, params, config) {
    return function (target, propertyKey, descriptor) {
        const method = descriptor.value;
        if (!method)
            return;
        const metadata = Reflect.getMetadata(propertyKey, target);
        descriptor.value = async function (...args) {
            return __request({
                url: url,
                params: (typeof params === 'function') ? params(args) : params,
                config: config,
                response: await method.apply(this, args),
                error: metadata && metadata.error,
                mock: metadata && (() => metadata.mock)
            }, {
                config: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }
            }, this.init);
        };
    };
}
/*!
 * httpClientGet: Method decorator for HTTP API with GET method
 */
export function httpClientMock(data) {
    return function (target, propertyKey, descriptor) {
        // In case of non-production env and mock enabled,
        // if a mock handler is defined, skips HTTP request.
        if (process.env.NODE_ENV !== 'production' && process.env.MOCK !== 'none') {
            const metadata = Reflect.getMetadata(propertyKey, target);
            Reflect.defineMetadata(propertyKey, { ...metadata, mock: data }, target);
        }
    };
}
/*！
 * makeHttpClient: Create an HTTP client.
 */
export function makeHttpClient(init, apis) {
    return new HttpClientImpl(init, apis);
}
class HttpClientImpl {
    httpAPIs;
    baseURL;
    defaultParams;
    defaultConfig;
    requestInterceptors;
    responseInterceptors;
    errorInterceptors;
    constructor(init, apis) {
        this.httpAPIs = apis;
        this.baseURL = init.baseURL;
        this.defaultParams = init.defaultParams;
        this.defaultConfig = init.defaultConfig;
        this.requestInterceptors = init.requestInterceptors;
        this.responseInterceptors = init.responseInterceptors;
        this.errorInterceptors = init.errorInterceptors;
    }
    async fetch(api, options) {
        let httpAPI = this.httpAPIs[api];
        if (!httpAPI) {
            return Promise.reject('The API \"' + api + '\" does NOT exist');
        }
        return __request(httpAPI, options, this);
    }
}
async function __response(api, request, data, init) {
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
async function __error(api, request, error, init) {
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
    }
    catch {
        return error;
    }
}
async function __request(api, options, init) {
    // Make a request object
    let request = {
        url: init?.baseURL + (options?.url ? options.url : api.url),
        params: __merge(__merge((typeof init?.defaultParams == 'function') ? init.defaultParams() : init?.defaultParams, (typeof api.params == 'function') ? api.params() : api.params), (typeof options?.params == 'function') ? options.params() : options?.params),
        config: __merge(__merge((typeof init?.defaultConfig == 'function') ? init.defaultConfig() : init?.defaultConfig, (typeof api.config == 'function') ? api.config() : api.config), (typeof options?.config == 'function') ? options.config() : options?.config)
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
    }
    catch (error) {
        return Promise.reject(await __error(api, request, error, init));
    }
}
function __merge(obj1, obj2) {
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
