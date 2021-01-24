import React from 'react';
/*!
 * makeModel: Create a model.
 */
export function makeModel(init) {
    return new ModelImpl(init);
}
/*!
 * useModel: Uses the model similar to React Hooks, and inlinely involves
 *           connection between the update event and React Hooks dispatch.
 */
export function useModel(model) {
    var _a = React.useState(model.state), state = _a[0], setState = _a[1];
    var onUpdated = function (s) {
        setState(s);
    };
    React.useEffect(function () {
        model.subscribe(onUpdated);
        return function () {
            model.unsubscribe(onUpdated);
        };
    }, [state]);
    return state;
}
var ModelImpl = /** @class */ (function () {
    function ModelImpl(init) {
        this.state = init.state;
        this._query = init.query;
        this._update = init.update;
        this._eventUpdated = new Set();
    }
    ModelImpl.prototype.get = function () {
        return this.state;
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
    };
    ModelImpl.prototype.subscribe = function (callback) {
        this._eventUpdated.add(callback);
    };
    ModelImpl.prototype.unsubscribe = function (callback) {
        this._eventUpdated.delete(callback);
    };
    return ModelImpl;
}());
