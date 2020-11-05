import React from 'react';
/*!
 * useModel: a function with the style of React Hooks, which inlinely involves bind and unbind.
 */
export function useModel(model) {
    var _a = React.useState(model.state), state = _a[0], setState = _a[1];
    var updated = function (state) {
        setState(state);
    };
    React.useEffect(function () {
        model.subscribeUpdate(updated);
        return function () {
            model.unsubscribeUpdate(updated);
        };
    }, [state]);
    return state;
}
