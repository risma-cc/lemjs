import React, { useEffect } from 'react';
import { Model, ModelInit } from '../index';

/*!
 * makeModel: Create a model.
 */
export function makeModel<T>(init: ModelInit<T>): Model<T> {
    return new ModelImpl<T>(init);
}

/*!
 * useModel: Uses the model similar to React Hooks, and inlinely involves
 *           connection between the update event and React Hooks dispatch.
 */
export function useModel<T>(model: Model<T>): T {
    const [ state, setState ] = React.useState(model.get());

    useEffect(() => {
        model.subscribe(setState);
        return () => {
            model.unsubscribe(setState);
        }
    }, [ state ]);

    return state;
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
            this._eventUpdated.forEach(e => {
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
