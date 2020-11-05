import React from 'react';
import { Model } from '../index';

/*!
 * useModel: a function with the style of React Hooks, which inlinely involves bind and unbind.
 */
export function useModel<T>(model: Model<T>): T {
    const [state, setState] = React.useState(model.state);
    const updated = (state: T) => {
        setState(state);
    }

    React.useEffect(() => {
        model.subscribeUpdate(updated);
        return () => {
            model.unsubscribeUpdate(updated);
        }
    }, [state]);

    return state;
}
