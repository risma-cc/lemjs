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
export var LocalStorage;
(function (LocalStorage) {
    /*!
     * getString: Read a string from local storage.
     */
    function getString(key) {
        return localStorage.getItem(key);
    }
    LocalStorage.getString = getString;
    /*!
     * getObject: Read an object with JSON format from local storage.
     */
    function getObject(key) {
        var data = localStorage.getItem(key);
        if (data === null) {
            return null;
        }
        return JSON.parse(data);
    }
    LocalStorage.getObject = getObject;
    ;
    /*!
     * set: Write a pair of key/value to local storage.
     */
    function set(key, value) {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
    LocalStorage.set = set;
    ;
})(LocalStorage || (LocalStorage = {}));
export var SessionStorage;
(function (SessionStorage) {
    /*!
     * getString: Read a string from session storage.
     */
    function getString(key) {
        return sessionStorage.getItem(key);
    }
    SessionStorage.getString = getString;
    /*!
     * getObject: Read an object with JSON format from session storage.
     */
    function getObject(key) {
        var data = sessionStorage.getItem(key);
        if (data === null) {
            return null;
        }
        return JSON.parse(data);
    }
    SessionStorage.getObject = getObject;
    ;
    /*!
     * set: Write a pair of key/value to session storage.
     */
    function set(key, value) {
        sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
    SessionStorage.set = set;
    ;
})(SessionStorage || (SessionStorage = {}));
export var AsyncFileReader;
(function (AsyncFileReader) {
    /*!
     * readAsArrayBuffer: Promise-based encapsulation of FileReader.readAsArrayBuffer.
     */
    function readAsArrayBuffer(file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader;
                        reader.readAsArrayBuffer(file);
                        reader.onload = function () {
                            resolve(reader.result);
                        };
                        reader.onloadend = function () {
                            reject('FileReader failed');
                        };
                    })];
            });
        });
    }
    AsyncFileReader.readAsArrayBuffer = readAsArrayBuffer;
    /*!
     * readAsDataURL: Promise-based encapsulation of FileReader.readAsDataURL.
     */
    function readAsDataURL(file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader;
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            resolve(reader.result);
                        };
                        reader.onloadend = function () {
                            reject('FileReader failed');
                        };
                    })];
            });
        });
    }
    AsyncFileReader.readAsDataURL = readAsDataURL;
    /*!
     * readAsText: Promise-based encapsulation of FileReader.readAsText.
     */
    function readAsText(file, encoding) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var reader = new FileReader;
                        reader.readAsText(file, encoding);
                        reader.onload = function () {
                            resolve(reader.result);
                        };
                        reader.onloadend = function () {
                            reject('FileReader failed');
                        };
                    })];
            });
        });
    }
    AsyncFileReader.readAsText = readAsText;
})(AsyncFileReader || (AsyncFileReader = {}));
