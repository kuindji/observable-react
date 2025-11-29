# Observable React hooks

> ⚠️ **DEPRECATED**: This package is no longer maintained. Further development has moved to [@kuindji/reactive](https://www.npmjs.com/package/@kuindji/reactive). Please migrate to the new package for continued support and new features.

React hooks for Observable (@kuindji/observable)

## useOn
```javascript
import Observable from "@kuindji/observable"
import { useOn } from "@kuindji/observable-react"

function MyComponent() {

    // create it here or get from somewhere else
    // Typed observables are supported
    const observable = useMemo(() => new Observable(), []);

    // all parameters are dynamic
    useOn(observable, "eventName", callbackFunction, options = {});

    useOn(observable, {
        eventName1: callbackFunction1,
        eventName2: callbackFunction2
    });

    useOn(observable, [
        { name: "eventName1", listener: callbackFunction1, options = {}},
        { name: "eventName2", listener: callbackFunction2, options = {}}
    ]);

    return (
        <></>
    )
}
```

## useObservable
useObservable is a useContext wrapper and Provider is a predefined Context.

```javascript
import Observable from "@kuindji/observable"
import { useOn, useObservable, Provider } from "@kuindji/observable-react"

function App() {

    const observable = useMemo(() => new Observable(), []);

    return (
        <Provider observable={ observable }>
            <MyComponent/>
        </Provider>
    )
}

function MyComponent() {
    const observable = useObservable();
    useOn(observable, ...);
    return (...)
}

```
```javascript 
import { createContext } from "react"
import Observable from "@kuindji/observable"
import { useObservable, Provider } from "@kuindji/observable-react"

const ObservableContext = createContext();

function App() {
    const observable = useMemo(() => new Observable(), []);
    return (
        <ObservableContext.Provider value={ observable }>
            <MyComponent/>
        </ObservableContext.Provider>
    )
}

function MyComponent() {
    const observable = useObservable(ObservableContext);
}
```