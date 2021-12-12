/*!
 * ModelInit: Definition of model for initialization
 */
export interface ModelInit<T> {
    /*!
     * state: Initial values of the state
     */
    state: T;

    /*!
     * query: Defines functions of query actions.
     */
    query?: { [x: string]: (payload: any, state: T) => any };

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
     * query: Dispatches a synchronous action to query the state.
     */
    query: (action: string, payload?: any) => any;

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
    private _query: any;
    private _update: any;
    private _eventUpdated: Set<(state: T) => void>;

    constructor(init: ModelInit<T>) {
        this.state = init.state;
        this._query = init.query;
        this._update = init.update;
        this._eventUpdated = new Set<(state: T) => void>();
    }

    get() {
        return this.state;
    }

    query(action: string, payload?: any): any {
        try {
            return this._query[action](payload, this.state);
        } catch (error) {
            return null;
        }
    }

    update(action: string, payload?: any) {
        try {
            this.state = this._update[action](payload, this.state);
            this._eventUpdated.forEach((e) => {
                e(this.state);
            });
        } catch (error) {
        }
    }

    subscribe(callback: (state: T) => void) {
        this._eventUpdated.add(callback);
    }

    unsubscribe(callback: (state: T) => void) {
        this._eventUpdated.delete(callback);
    }
}
