import React, { useMemo } from 'react';
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
    var _a = React.useState(model), _model = _a[0], setModel = _a[1];
    // const cb = (s: T) => {
    //     setState(s)
    // }
    // useEffect(() => {
    //     model.subscribe(setState);
    //     return () => {
    //         model.unsubscribe(setState);
    //     }
    // }, [ state ]);
    return useMemo(function () {
        setModel(model);
        return _model.get();
    }, [_model]);
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
