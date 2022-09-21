/*!
 * jsonBody: Converts an object to an JSON string
 */
export function jsonBody(value) {
    return JSON.stringify(value);
}
/*!
 * formBody: Converts elements to a FormData, e.g. file
 */
export function formBody(elements) {
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
    if (resp.status === 301 || resp.status === 302) { // Redirect
        const l = resp.headers.get('Location');
        window.location.assign(l == null ? '' : l);
    }
    throw Error(resp.statusText);
}
/*!
 * httpGet: Send an HTTP GET request and return a response
 */
export function httpGet(url, params, config) {
    return httpRequest({
        url: url,
        params: params,
        config: { ...config, method: 'GET' },
    });
}
/*!
 * httpPost: Send an HTTP POST request and return a response
 */
export function httpPost(url, params, config) {
    return httpRequest({
        url: url,
        params: params,
        config: { ...config, method: 'POST' },
    });
}
/*!
 * httpPostJson: Send an HTTP POST request with JSON body and return a response
 */
export function httpPostJson(url, params, config) {
    return httpRequest({
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
export class HttpRequestController {
    url;
    params;
    config;
    controller = new AbortController();
    constructor(req) {
        this.url = req.url;
        this.params = req.params;
        if (typeof req.config === 'function') {
            const configProc = req.config;
            const signal = this.controller.signal;
            this.config = () => {
                return { ...configProc(), signal: signal };
            };
        }
        else {
            this.config = { ...req.config, signal: this.controller.signal };
        }
    }
    abort() {
        this.controller.abort();
    }
}
/*!
 * HttpClientRequest: Definition of HTTP client request.
 */
export class HttpClientRequest extends HttpRequestController {
    client;
    response;
    error;
    mock;
    constructor(client, request, handlers) {
        super(request);
        this.client = client;
        this.response = handlers?.response;
        this.error = handlers?.error;
        this.mock = handlers?.mock;
    }
    async send() {
        try {
            if (this.client.requestInterceptor) {
                if (!this.client.requestInterceptor(this)) {
                    throw 'The request \"' + this.url + '\" was cancelled in interceptor.';
                }
            }
            // In case of non-production env and mock enabled,
            // if a mock handler is defined, skips HTTP request.
            if (process.env.NODE_ENV !== 'production' && process.env.MOCK !== 'none') {
                if (this.mock) {
                    return this.__response(this.mock(this));
                }
            }
            return this.__response(await httpRequest(this));
        }
        catch (err) {
            throw await this.__error(err);
        }
    }
    async __response(data) {
        try {
            data = this.client.responseInterceptor
                ? await this.client.responseInterceptor(data, this)
                : data;
            return this.response
                ? await this.response(data, this)
                : data;
        }
        catch (err) {
            throw await this.__error(err);
        }
    }
    async __error(error) {
        try {
            error = this.client.errorInterceptor
                ? await this.client.errorInterceptor(error, this)
                : error;
            return this.error
                ? this.error(error, this)
                : error;
        }
        catch (err) {
            return err;
        }
    }
}
export function httpClientGet(client, request, handlers) {
    return httpClientRequest(client, request, { method: 'GET' }, handlers);
}
export function httpClientPost(client, request, handlers) {
    return httpClientRequest(client, request, { method: 'POST' }, handlers);
}
export function httpClientPostJson(client, request, handlers) {
    return httpClientRequest(client, request, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, handlers);
}
export function httpClientRequest(client, request, config, handlers) {
    return new HttpClientRequest(client, {
        url: client.baseURL + request.url,
        params: {
            ...(typeof client.defaultParams === 'function') ? client.defaultParams() : client.defaultParams,
            ...(typeof request.params === 'function') ? request.params() : request.params
        },
        config: __mergeConfig(__mergeConfig((typeof client.defaultConfig == 'function') ? client.defaultConfig() : client.defaultConfig, (typeof request.config === 'function') ? request.config() : request.config), config)
    }, handlers);
}
function __mergeConfig(cfg1, cfg2) {
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
    };
}
