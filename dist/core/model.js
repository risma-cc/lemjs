/*!
 * makeModel: Create a model.
 */
export function makeModel(init) {
    return new ModelImpl(init);
}
class ModelImpl {
    state;
    _query;
    _update;
    _eventUpdated;
    constructor(init) {
        this.state = init.state;
        this._query = init.query;
        this._update = init.update;
        this._eventUpdated = new Set();
    }
    get() {
        return this.state;
    }
    query(action, payload) {
        try {
            return this._query[action](payload, this.state);
        }
        catch (error) {
            return null;
        }
    }
    update(action, payload) {
        try {
            this.state = this._update[action](payload, this.state);
            this._eventUpdated.forEach((e) => {
                e(this.state);
            });
        }
        catch (error) {
        }
    }
    subscribe(callback) {
        this._eventUpdated.add(callback);
    }
    unsubscribe(callback) {
        this._eventUpdated.delete(callback);
    }
}
