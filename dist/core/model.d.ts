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
    update?: {
        [x: string]: (payload: any, state: T) => T;
    };
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
export declare function makeModel<T>(init: ModelInit<T>): Model<T>;
