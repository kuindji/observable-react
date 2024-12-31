import { useMemo, useEffect, useRef } from "react";
import Observable, {
    BaseMap,
    EventMap,
    InferObservableType,
    ListenerFunction,
    ListenerOptions,
    MapKey,
} from "@kuindji/observable";
import {
    ObservableHookEventList,
    ObservableHookEventMap,
    ObservableHookEventSetting,
} from "../types";

function subscribe<Map extends BaseMap>(
    o: Observable,
    list: ObservableHookEventList<Map>
) {
    list.forEach((entry) => {
        o.on && o.on(entry.name, entry.listener, entry.options);
    });
}

function unsubscribe<Map extends BaseMap>(
    o: Observable,
    list: ObservableHookEventList<Map>
) {
    list.forEach((entry) => {
        o.un && o.un(entry.name, entry.listener, entry.options?.context);
    });
}

function findEventListEntryIndex<Map extends BaseMap>(
    list: ObservableHookEventList<Map>,
    entry: ObservableHookEventSetting<Map>
) {
    return list.findIndex((e) => {
        if (e.name !== entry.name) {
            return false;
        }
        if (e.listener !== entry.listener) {
            return false;
        }
        if (
            !!e.options?.context &&
            !!entry.options?.context &&
            e.options.context !== entry.options.context
        ) {
            return false;
        }
        return true;
    });
}

function getDiff<Map extends BaseMap>(
    a: ObservableHookEventList<Map>,
    b: ObservableHookEventList<Map>
): ObservableHookEventList<Map> {
    const c: ObservableHookEventList<Map> = [];

    a.forEach((entry) => {
        if (findEventListEntryIndex<Map>(b, entry) === -1) {
            c.push(entry);
        }
    });

    return c;
}

function useOn<
    O extends Observable,
    InfO extends InferObservableType<O> = InferObservableType<O>,
    Map extends BaseMap = InfO["EventsMap"],
    E extends MapKey & keyof Map = keyof Map,
    EName extends MapKey = E,
    Event extends Map[E] = Map[E]
>(
    o: O,
    eventSetup: E,
    listener: Event["handler"],
    listenerOptions?: Event["listenerOptions"]
): void;

function useOn<
    O extends Observable,
    InfO extends InferObservableType<O> = InferObservableType<O>,
    Map extends BaseMap = InfO["EventsMap"],
    E extends ObservableHookEventList<Map> = ObservableHookEventList<Map>,
    EName extends MapKey = never,
    Event extends Map[any] = never
>(o: O, eventSetup: E): void;

function useOn<
    O extends Observable,
    InfO extends InferObservableType<O> = InferObservableType<O>,
    Map extends BaseMap = InfO["EventsMap"],
    E extends ObservableHookEventMap<Map> = ObservableHookEventMap<Map>,
    EName extends MapKey = never,
    Event extends Map[any] = never
>(o: O, eventSetup: E): void;

function useOn<
    O extends Observable,
    E extends MapKey,
    InfO extends InferObservableType<O> = InferObservableType<O>,
    Map extends BaseMap = InfO["EventsMap"],
    EName extends MapKey = [E] extends [MapKey] ? E : any,
    Event extends Map[any] = Map[EName]
>(
    o: O & InfO["Type"],
    eventSetup: E,
    listener?: Event["handler"],
    listenerOptions?: Event["listenerOptions"]
): void {
    if (typeof eventSetup === "string" && !listener) {
        throw new Error("Event listener is empty");
    }

    const list = useMemo<
        ObservableHookEventList<Map>
    >((): ObservableHookEventList<Map> => {
        if (Array.isArray(eventSetup)) {
            return eventSetup;
        }

        if (
            typeof eventSetup === "string" ||
            typeof eventSetup === "symbol" ||
            typeof eventSetup === "number"
        ) {
            return (<E extends MapKey & keyof Map>(
                name: E
            ): ObservableHookEventList<Map> => [
                {
                    name: name as MapKey,
                    listener: listener as Map[E]["handler"],
                    options: listenerOptions as Map[E]["listenerOptions"],
                },
            ])(eventSetup);
        }

        return Object.keys(eventSetup as ObservableHookEventMap<Map>).map(
            <K extends keyof Map>(name: K) => ({
                name,
                listener: eventSetup[name as MapKey] as Map[K]["handler"],
            })
        ) as ObservableHookEventList<Map>;
    }, [eventSetup, listener, listenerOptions]);

    const obsRef = useRef<InfO["Type"] | null>(o);
    const currList = useRef<ObservableHookEventList<Map>>(list);
    const prevList = useRef<ObservableHookEventList<Map> | null>(null);

    currList.current = list;

    useEffect(() => {
        // need to synchronize
        if (obsRef.current) {
            if (prevList.current) {
                const oldEvents = getDiff<Map>(prevList.current, list);
                const newEvents = getDiff<Map>(list, prevList.current);
                unsubscribe<Map>(obsRef.current, oldEvents);
                subscribe<Map>(obsRef.current, newEvents);
            } else {
                subscribe<Map>(obsRef.current, list);
            }

            prevList.current = [...list];
        }
    }, [list]);

    useEffect(() => {
        if (obsRef.current === o) {
            return;
        } else {
            if (obsRef.current === null && o !== null) {
                obsRef.current = o;
                if (currList.current) {
                    subscribe<Map>(obsRef.current, currList.current);
                }
            } else if (obsRef.current !== null && o === null) {
                unsubscribe<Map>(obsRef.current, currList.current);
                obsRef.current = null;
            } else {
                if (currList.current) {
                    !!obsRef.current &&
                        unsubscribe<Map>(obsRef.current, currList.current);
                    !!o && subscribe<Map>(o, currList.current);
                }
                obsRef.current = o;
            }
        }
    }, [o]);

    useEffect(
        () => () => {
            if (obsRef.current) {
                prevList.current = null;
                unsubscribe<Map>(obsRef.current, currList.current);
            }
        },
        []
    );
}

export default useOn;
