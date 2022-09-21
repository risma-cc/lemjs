/*!
 * ModelInit: Definition of model for initialization
 */
export interface ModelInit<T> {
    /*!
     * state: Initial values of the state
     */
    state: T;

    /*!
     * update: Defines functions of update actions whose returning values will be set to the state.
     */
    update?: { [x: string]: (payload: any, state: T) => T };
}

/*!
 * Model: The model for managing shared stateful data
 */
export interface Model<T> {
    /*!
     * getState: Returns the values of state
     */
    get: () => T;

    /*!
     * update: Dispatches a synchronous action to update the state.
     */
    update: (action: string, payload?: any) => void;

    /*!
     * subscribe: Subscribes the update event.
     */
    subscribe: (callback: (state: T) => void) => void;

    /*!
     * unsubscribe: Unsubscribes the update event.
     */
    unsubscribe: (callback: (state: T) => void) => void;
}

/*!
 * makeModel: Create a model.
 */
export function makeModel<T>(init: ModelInit<T>): Model<T> {
    return new ModelImpl<T>(init);
}

class ModelImpl<T> implements Model<T> {
    state: T;
    private _update: any;
    private _callbacks: Set<(state: T) => void>;

    constructor(init: ModelInit<T>) {
        this.state = init.state;
        this._update = init.update;
        this._callbacks = new Set<(state: T) => void>();
    }

    get() {
        return this.state;
    }

    update(action: string, payload?: any) {
        const f = this._update[action];
        if (typeof f === 'function') {
            this.state = (f ) && f(payload, this.state);
            this._callbacks.forEach((cb) => {
                cb(this.state);
            });
        }
    }

    subscribe(callback: (state: T) => void) {
        this._callbacks.add(callback);
    }

    unsubscribe(callback: (state: T) => void) {
        this._callbacks.delete(callback);
    }
}
