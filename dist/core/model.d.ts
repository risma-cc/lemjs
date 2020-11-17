import { Model, ModelInit } from '../index';
/*!
 * makeModel: Create a model.
 */
export declare function makeModel<T>(init: ModelInit<T>): Model<T>;
/*!
 * useModel: Uses the model similar to React Hooks, and inlinely involves
 *           connection between the update event and React Hooks dispatch.
 */
export declare function useModel<T>(model: Model<T>): T;
