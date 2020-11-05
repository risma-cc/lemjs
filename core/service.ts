import { HttpClient, getHttpClient, HttpRequestOptions, HttpService, HttpServiceInit, HttpAPI, HttpParams, HttpConfig } from '../index';

/*！
 * enableMock: Enable or disable mock handlers globaly.
 */
export let enableMock: boolean = true;

export function makeHttpService(config: HttpServiceInit): HttpService {
    return new HttpServiceImpl(config);
}

class HttpServiceImpl implements HttpService {
    baseURL: string;
    defaultParams: HttpParams;
    defaultConfig: HttpConfig;
    httpAPIs: Record<string, HttpAPI>;
    httpClient: HttpClient;

    constructor(init: HttpServiceInit) {
        this.baseURL = init.baseURL;
        this.defaultParams = init.defaultParams ? init.defaultParams : {};
        this.defaultConfig = init.defaultConfig ? init.defaultConfig : {};
        this.httpAPIs = init.httpAPIs;
        this.httpClient = init.httpClient ? init.httpClient : getHttpClient();
    }

    async fetch(api: string, options?: HttpRequestOptions): Promise<any> {
        var httpAPI;
        try {
            httpAPI = this.httpAPIs[api];console.log(httpAPI)
        } catch(error) {
            return Promise.reject('The API \"' + api + '\" does NOT exist');
        }
        try {
            // Make a request object
            let request = {
                url: httpAPI.request.url,
                params: { ...this.defaultParams, ...httpAPI.request.params },
                config: { ...this.defaultConfig, ...httpAPI.request.config }
            };
            if (options) {
                request.params = { ...request.params, ...options.params };
                request.config = { ...request.config, ...options.config };
                if (options.url) {
                    request.url = options.url;
                }
            }
            request.url = this.baseURL + request.url;

            // If mock is enabled and a mock handler is defined, skips HTTP request and response
            if (enableMock) {
                const mockHandler = httpAPI['mock'];
                if (mockHandler != undefined) {
                    return mockHandler(request);
                }
            }
            let data = await this.httpClient.request(request);
            let responseHanlder = httpAPI['response'];
            if (responseHanlder) {
                data = await responseHanlder(data, this);
            }
            return data;
        } catch (error) {
            let errorHanlder = httpAPI['error'];
            if (errorHanlder) {
                await errorHanlder(error, this);
            }
            return Promise.reject(error);
        }
    }
}
