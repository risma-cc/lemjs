import { Model, ModelInit } from '../index';

export function makeModel<T>(init: ModelInit<T>): Model<T> {
    return new ModelImpl<T>(init);
}

class ModelImpl<T> implements Model<T> {
    state: T;
    private _query: any;
    private _update: any;
    private _put: any;
    private _eventUpdated: Set<(state: T) => void>;
    private _eventLoading: ((status: boolean, action: string) => void) | null = null;
    private _loadingCount = 0;

    constructor(init: ModelInit<T>) {
        this.state = init.state;
        this._query = init.query;
        this._update = init.update;
        this._put = init.put;
        this._eventUpdated = new Set<(state: T) => void>();
    }

    subscribeUpdate(callback: (state: T) => void) {
        this._eventUpdated.add(callback);
    }

    unsubscribeUpdate(callback: (state: T) => void) {
        this._eventUpdated.delete(callback);
    }

    subscribeLoading(callback: (status: boolean, action: string) => void) {
        this._eventLoading = callback;
    }

    unsubscribeLoading(callback: (status: boolean, action: string) => void) {
        if (this._eventLoading === callback) {
            this._eventLoading = null;
        }
    }

    query(action: string, payload: any): any {
        try {
            return this._query[action](payload, this.state);
        } catch (error) {
            return null;
        }
    }

    update(action: string, payload: any): T {
        try {
            this.state = this._update[action](payload, this.state);
            this._eventUpdated.forEach(e => {
                e(this.state);
            });
        } catch (error) {
        }
        return this.state;
    }

    async put(action: string, payload: any): Promise<void> {
        try {
            this._loadingCount++;
            if (this._loadingCount === 1 && this._eventLoading) {
                this._eventLoading(true, action);
            }
            await this._put[action](payload, this.state);
        } catch (error) {
        }
        this._loadingCount--;
        if (this._loadingCount === 0 && this._eventLoading) {
            this._eventLoading(false, action);
        }
    }
}
