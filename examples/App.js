import { ObservableProvider, useOn } from "@kuindji/observable-react"
import Observable from "@kuindji/observable"

function Component() {

    const o = useObservable();
    useOn(o, "event", listener, listenerOptions);
    useOn(o, {
        event1: listener1,
        event2: listener2
    });
    useOn(o, [
        { name: "event1", listener1, options },
        { name: "event2", listener2, options }
    ])
}

function App() {

    const o = useMemo(() => new Observable(), []);

    return (
        <ObservableProvider observable={ o }>
            <Component/>
        </ObservableProvider>
    )
}