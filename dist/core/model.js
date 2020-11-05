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
export function makeModel(init) {
    return new ModelImpl(init);
}
var ModelImpl = /** @class */ (function () {
    function ModelImpl(init) {
        this._eventLoading = null;
        this._loadingCount = 0;
        this.state = init.state;
        this._query = init.query;
        this._update = init.update;
        this._put = init.put;
        this._eventUpdated = new Set();
    }
    ModelImpl.prototype.subscribeUpdate = function (callback) {
        this._eventUpdated.add(callback);
    };
    ModelImpl.prototype.unsubscribeUpdate = function (callback) {
        this._eventUpdated.delete(callback);
    };
    ModelImpl.prototype.subscribeLoading = function (callback) {
        this._eventLoading = callback;
    };
    ModelImpl.prototype.unsubscribeLoading = function (callback) {
        if (this._eventLoading === callback) {
            this._eventLoading = null;
        }
    };
    ModelImpl.prototype.query = function (action, payload) {
        try {
            return this._query[action](payload, this.state);
        }
        catch (error) {
            return null;
        }
    };
    ModelImpl.prototype.update = function (action, payload) {
        var _this = this;
        try {
            this.state = this._update[action](payload, this.state);
            this._eventUpdated.forEach(function (e) {
                e(_this.state);
            });
        }
        catch (error) {
        }
        return this.state;
    };
    ModelImpl.prototype.put = function (action, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this._loadingCount++;
                        if (this._loadingCount === 1 && this._eventLoading) {
                            this._eventLoading(true, action);
                        }
                        return [4 /*yield*/, this._put[action](payload, this.state)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3:
                        this._loadingCount--;
                        if (this._loadingCount === 0 && this._eventLoading) {
                            this._eventLoading(false, action);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ModelImpl;
}());
