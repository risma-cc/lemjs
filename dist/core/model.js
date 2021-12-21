/*!
 * makeModel: Create a model.
 */
export function makeModel(init) {
    return new ModelImpl(init);
}
class ModelImpl {
    state;
    _update;
    _callbacks;
    constructor(init) {
        this.state = init.state;
        this._update = init.update;
        this._callbacks = new Set();
    }
    get() {
        return this.state;
    }
    update(action, payload) {
        try {
            this.state = this._update[action](payload, this.state);
            this._callbacks.forEach((cb) => {
                cb(this.state);
            });
        }
        catch (error) {
        }
    }
    subscribe(callback) {
        this._callbacks.add(callback);
    }
    unsubscribe(callback) {
        this._callbacks.delete(callback);
    }
}
