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
        config: __mergeConfig(config, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }),
    });
}
export async function httpClientGet(client, api) {
    return __request(client, api, { method: 'GET' });
}
export async function httpClientPost(client, api) {
    return __request(client, api, { method: 'POST' });
}
export async function httpClientPostJson(client, api) {
    return __request(client, api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
}
async function __request(client, api, config) {
    // Make a request object
    let request = {
        url: client.baseURL + api.url,
        params: {
            ...(typeof client.defaultParams === 'function') ? client.defaultParams() : client.defaultParams,
            ...(typeof api.params === 'function') ? api.params() : api.params
        },
        config: __mergeConfig(__mergeConfig((typeof client.defaultConfig == 'function') ? client.defaultConfig() : client.defaultConfig, (typeof api.config === 'function') ? api.config() : api.config), config)
    };
    try {
        if (client.requestInterceptors) {
            for (let interceptor of client.requestInterceptors) {
                const req = await interceptor(request);
                if (!req) {
                    return Promise.reject(await __error(client, request, 'The request \"' + api.url + '\" was cancelled.', api.error));
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
    }
    catch (error) {
        return Promise.reject(await __error(client, request, error, api.error));
    }
}
async function __response(client, request, data, responseHandler) {
    if (client.responseInterceptors) {
        for (let interceptor of client.responseInterceptors) {
            data = await interceptor(data, request);
        }
    }
    return responseHandler ? await responseHandler(data, request) : data;
}
async function __error(client, request, error, errorHandler) {
    try {
        if (client.errorInterceptors) {
            for (let interceptor of client.errorInterceptors) {
                error = await interceptor(error, request);
            }
        }
        return errorHandler ? await errorHandler(error, request) : error;
    }
    catch (err) {
        return err;
    }
}
function __mergeConfig(cfg1, cfg2) {
    if (!cfg2) {
        return cfg1;
    }
    if (!cfg1) {
        return cfg2;
    }
    return {
        ...cfg1, ...cfg2,
        headers: { ...cfg1.headers, ...cfg2.headers }
    };
}
