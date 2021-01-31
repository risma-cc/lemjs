var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/*!
 * JsonBody: Converts an object to a JSON string
 */
export function JsonBody(data) {
    return JSON.stringify(data);
}
/*!
 * FormBody: Converts elements to a FormData, e.g. file
 */
export function FormBody(elements) {
    var body = new FormData;
    elements.forEach(function (e) {
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
export function httpRequest(request) {
    return __awaiter(this, void 0, void 0, function () {
        var url, params, pathParams, _i, pathParams_1, p, n, v, queryParams, resp, contentType, l;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = request.url;
                    params = new URLSearchParams((typeof request.params == 'function') ? request.params() : request.params);
                    pathParams = url.match(/{(\S+)}/g);
                    if (pathParams) {
                        for (_i = 0, pathParams_1 = pathParams; _i < pathParams_1.length; _i++) {
                            p = pathParams_1[_i];
                            n = p.slice(1, -1);
                            v = params.get(n);
                            if (v) {
                                url = url.replace(p, v);
                                params.delete(n);
                            }
                        }
                    }
                    queryParams = params.toString();
                    if (queryParams.length > 0) {
                        url += '?' + queryParams;
                    }
                    return [4 /*yield*/, fetch(url, (typeof request.config == 'function') ? request.config() : request.config)];
                case 1:
                    resp = _a.sent();
                    if (!(resp.status >= 200 && resp.status < 300)) return [3 /*break*/, 11];
                    contentType = resp.headers.get('Content-Type');
                    if (!(contentType != null)) return [3 /*break*/, 9];
                    if (!(contentType.indexOf('text') > -1)) return [3 /*break*/, 3];
                    return [4 /*yield*/, resp.text()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    if (!(contentType.indexOf('form') > -1)) return [3 /*break*/, 5];
                    return [4 /*yield*/, resp.formData()];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    if (!(contentType.indexOf('json') > -1)) return [3 /*break*/, 7];
                    return [4 /*yield*/, resp.json()];
                case 6: return [2 /*return*/, _a.sent()];
                case 7: return [4 /*yield*/, resp.blob()];
                case 8: return [2 /*return*/, _a.sent()];
                case 9: return [4 /*yield*/, resp.text()];
                case 10: return [2 /*return*/, _a.sent()];
                case 11:
                    if (resp.status === 301 || resp.status === 302) { // Redirect
                        l = resp.headers.get('Location');
                        window.location.assign(l == null ? '' : l);
                    }
                    return [2 /*return*/, Promise.reject(resp.statusText)];
            }
        });
    });
}
/*!
 * httpGet: Send an HTTP GET request and return a response
 */
export function httpGet(url, params, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, httpRequest({
                        url: url,
                        params: params,
                        config: __assign(__assign({}, config), { method: 'GET' }),
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/*!
 * httpPost: Send an HTTP POST request and return a response
 */
export function httpPost(url, params, config) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, httpRequest({
                        url: url,
                        params: params,
                        config: __assign(__assign({}, config), { method: 'POST' }),
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/*！
 * makeHttpClient: Create an HTTP client.s
 */
export function makeHttpClient(init) {
    return new HttpClientImpl(init);
}
var HttpClientImpl = /** @class */ (function () {
    function HttpClientImpl(init) {
        this.httpAPIs = init.httpAPIs;
        this.baseURL = init.baseURL ? init.baseURL : "";
        this.defaultParams = init.defaultParams ? init.defaultParams : {};
        this.defaultConfig = init.defaultConfig ? init.defaultConfig : {};
        this.requestInterceptors = init.requestInterceptors;
        this.responseInterceptors = init.responseInterceptors;
        this.errorInterceptors = init.errorInterceptors;
    }
    HttpClientImpl.prototype.fetch = function (api, options) {
        return __awaiter(this, void 0, void 0, function () {
            var httpAPI, request, _i, _a, handler, req, _b, _c, mockHandler, data, error_1, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        try {
                            httpAPI = this.httpAPIs[api];
                            if (!httpAPI) {
                                return [2 /*return*/, Promise.reject('The API \"' + api + '\" does NOT exist')];
                            }
                        }
                        catch (error) {
                            return [2 /*return*/, Promise.reject('The API \"' + api + '\" does NOT exist')];
                        }
                        request = {
                            url: this.baseURL + ((options === null || options === void 0 ? void 0 : options.url) ? options.url : httpAPI.url),
                            params: __assign(__assign(__assign({}, ((typeof this.defaultParams == 'function') ? this.defaultParams() : this.defaultParams)), ((typeof httpAPI.params == 'function') ? httpAPI.params() : httpAPI.params)), ((typeof (options === null || options === void 0 ? void 0 : options.params) == 'function') ? options === null || options === void 0 ? void 0 : options.params() : options === null || options === void 0 ? void 0 : options.params)),
                            config: __assign(__assign(__assign({}, ((typeof this.defaultConfig == 'function') ? this.defaultConfig() : this.defaultConfig)), ((typeof httpAPI.config == 'function') ? httpAPI.config() : httpAPI.config)), ((typeof (options === null || options === void 0 ? void 0 : options.config) == 'function') ? options === null || options === void 0 ? void 0 : options.config() : options === null || options === void 0 ? void 0 : options.config))
                        };
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 12, , 14]);
                        if (!this.requestInterceptors) return [3 /*break*/, 7];
                        _i = 0, _a = this.requestInterceptors;
                        _f.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        handler = _a[_i];
                        return [4 /*yield*/, handler(request)];
                    case 3:
                        req = _f.sent();
                        if (!!req) return [3 /*break*/, 5];
                        _c = (_b = Promise).reject;
                        return [4 /*yield*/, this.errorProc(httpAPI, request, 'The API \"' + api + '\" request was cancelled.')];
                    case 4: return [2 /*return*/, _c.apply(_b, [_f.sent()])];
                    case 5:
                        request = req;
                        _f.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        if (!(process.env.NODE_ENV !== 'production' && process.env.MOCK !== 'none')) return [3 /*break*/, 9];
                        mockHandler = httpAPI['mock'];
                        if (!(mockHandler != undefined)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.responseProc(httpAPI, request, mockHandler(request))];
                    case 8: return [2 /*return*/, _f.sent()];
                    case 9: return [4 /*yield*/, httpRequest(request)];
                    case 10:
                        data = _f.sent();
                        return [4 /*yield*/, this.responseProc(httpAPI, request, data)];
                    case 11: return [2 /*return*/, _f.sent()];
                    case 12:
                        error_1 = _f.sent();
                        _e = (_d = Promise).reject;
                        return [4 /*yield*/, this.errorProc(httpAPI, request, error_1)];
                    case 13: return [2 /*return*/, _e.apply(_d, [_f.sent()])];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    HttpClientImpl.prototype.responseProc = function (api, request, data) {
        return __awaiter(this, void 0, void 0, function () {
            var responseHanlder, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.responseInterceptors && this.responseInterceptors.forEach(function (handler) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, handler(data, request)];
                                    case 1:
                                        data = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        responseHanlder = api['response'];
                        if (!responseHanlder) return [3 /*break*/, 2];
                        return [4 /*yield*/, responseHanlder(data, request)];
                    case 1:
                        data = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, data];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, Promise.reject(error_2)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HttpClientImpl.prototype.errorProc = function (api, request, error) {
        return __awaiter(this, void 0, void 0, function () {
            var errorHanlder;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.errorInterceptors && this.errorInterceptors.forEach(function (handler) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, handler(error, request)];
                                    case 1:
                                        error = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        errorHanlder = api['error'];
                        if (!errorHanlder) return [3 /*break*/, 2];
                        return [4 /*yield*/, errorHanlder(error, request)];
                    case 1:
                        error = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, error];
                }
            });
        });
    };
    return HttpClientImpl;
}());
