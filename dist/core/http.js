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
 * httpApiRequest: Send an HTTP API request and return a response
 */
export async function httpApiRequest(base, api, options) {
    return __request(base, api, options);
}
/*!
 * httpApi: Method decorator for HTTP API
 */
export const httpApi = (base) => {
    return function (target, propertyKey, descriptor) {
        let method = descriptor.value;
        descriptor.value = async function () {
            let api = await method.apply(this, arguments);
            return httpApiRequest(base || {}, api);
        };
    };
};
/*!
 * httpApiGet: Method decorator for HTTP API with GET method
 */
export const httpApiGet = (base) => {
    return function (target, propertyKey, descriptor) {
        let method = descriptor.value;
        descriptor.value = async function () {
            let api = await method.apply(this, arguments);
            return httpApiRequest(base || {}, api, {
                config: { method: 'GET' }
            });
        };
    };
};
/*!
 * httpApiPost: Method decorator for HTTP API with POST method
 */
export const httpApiPost = (base) => {
    return function (target, propertyKey, descriptor) {
        let method = descriptor.value;
        descriptor.value = async function () {
            let api = await method.apply(this, arguments);
            return httpApiRequest(base || {}, api, {
                config: { method: 'POST' }
            });
        };
    };
};
/*!
 * httpApiPostJson: Method decorator for HTTP API with POST method and JSON content type
 */
export const httpApiPostJson = (base) => {
    return function (target, propertyKey, descriptor) {
        let method = descriptor.value;
        descriptor.value = async function () {
            let api = await method.apply(this, arguments);
            return httpApiRequest(base || {}, api, {
                config: {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }
            });
        };
    };
};
/*！
 * makeHttpClient: Create an HTTP client.
 */
export function makeHttpClient(init) {
    return new HttpClientImpl(init);
}
class HttpClientImpl {
    httpAPIs;
    baseURL;
    defaultParams;
    defaultConfig;
    requestInterceptors;
    responseInterceptors;
    errorInterceptors;
    constructor(init) {
        this.httpAPIs = init.httpAPIs;
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
        return __request(this, httpAPI, options);
    }
}
async function __response(base, api, request, data) {
    if (base.responseInterceptors) {
        for (let interceptor of base.responseInterceptors) {
            data = await interceptor(data, request);
        }
    }
    const respHanlder = api['response'];
    if (respHanlder) {
        data = await respHanlder(data, request);
    }
    return data;
}
async function __error(base, api, request, error) {
    try {
        if (base.errorInterceptors) {
            for (let interceptor of base.errorInterceptors) {
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
async function __request(base, api, options) {
    // Make a request object
    let request = {
        url: base.baseURL + (options?.url ? options.url : api.url),
        params: __merge(__merge((typeof base.defaultParams == 'function') ? base.defaultParams() : base.defaultParams, (typeof api.params == 'function') ? api.params() : api.params), (typeof options?.params == 'function') ? options?.params() : options?.params),
        config: __merge(__merge((typeof base.defaultConfig == 'function') ? base.defaultConfig() : base.defaultConfig, (typeof api.config == 'function') ? api.config() : api.config), (typeof options?.config == 'function') ? options?.config() : options?.config)
    };
    // let request: HttpRequest = {
    //     url: base.baseURL + (options?.url ? options.url : api.url),
    //     params: {
    //         ...((typeof base.defaultParams == 'function') ? base.defaultParams() : base.defaultParams),
    //         ...((typeof api.params == 'function') ? api.params() : api.params),
    //         ...((typeof options?.params == 'function') ? options?.params() : options?.params),
    //     },
    //     config: {
    //         ...((typeof base.defaultConfig == 'function') ? base.defaultConfig() : base.defaultConfig),
    //         ...((typeof api.config == 'function') ? api.config() : api.config),
    //         ...((typeof options?.config == 'function') ? options?.config() : options?.config),
    //     }
    // };
    try {
        if (base.requestInterceptors) {
            for (let interceptor of base.requestInterceptors) {
                const req = await interceptor(request);
                if (!req) {
                    return Promise.reject(await __error(base, api, request, 'The API \"' + api + '\" request was cancelled.'));
                }
                request = req;
            }
        }
        // In case of non-production env and mock enabled,
        // if a mock handler is defined, skips HTTP request.
        if (process.env.NODE_ENV !== 'production' && process.env.MOCK !== 'none') {
            const mockHandler = api['mock'];
            if (mockHandler != undefined) {
                return await __response(base, api, request, mockHandler(request));
            }
        }
        let data = await httpRequest(request);
        return await __response(base, api, request, data);
    }
    catch (error) {
        return Promise.reject(await __error(base, api, request, error));
    }
}
function __merge(obj1, obj2) {
    if (!obj1) {
        return obj2;
    }
    if (!obj2) {
        return obj1;
    }
    let key;
    for (key in obj2) {
        // 如果target(也就是obj1[key])存在，且是对象的话再去调用merge，
        // 否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
        // 如果obj2[key]没有值或者值不是对象，此时直接替换obj1[key]
        obj1[key] = obj1[key] &&
            obj1[key].toString() === "[object Object]" &&
            (obj2[key] && obj2[key].toString() === "[object Object]")
            ? __merge(obj1[key], obj2[key])
            : (obj1[key] = obj2[key]);
    }
    return obj1;
}
