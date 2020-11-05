import { HttpClient, HttpConfig, HttpParams, HttpRequest } from '../index';

class HttpClientImpl implements HttpClient {
    config: HttpConfig = {
        // mode: 'cors',
        // credentials: "same-origin",
        headers: new Headers(),
    };

    // constructor() {}

    setHeader(name: string, value: string) {
        (this.config.headers as Headers).set(name, value);
    }

    deleteHeader(name: string) {
        (this.config.headers as Headers).delete(name);
    }

    async request(request: HttpRequest) {
        let query = (new URLSearchParams(request.params)).toString();
        let req = new Request(request.url + (query.length > 0 ? ('?' + query) : ''), request.config);
        let resp = await fetch(req, this.config);

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
        const error = new Error(resp.statusText);
        throw error;
    }

    async get(url: string, params?: HttpParams, config?: HttpConfig) {
        return await this.request({
            url: url,
            params: params,
            config: { ...config, ...{ method: 'GET' } },
        });
    }

    async post(url: string, params?: HttpParams, config?: HttpConfig) {
        return await this.request({
            url: url,
            params: params,
            config: { ...config, ...{ method: 'POST' } },
        });
    }
}

let httpClient: HttpClient | null = null;

export function makeHttpClient(): HttpClient {
    return new HttpClientImpl();
}

export function getHttpClient(): HttpClient {
    if (httpClient === null) {
        httpClient = new HttpClientImpl();
    }
    return httpClient;
}