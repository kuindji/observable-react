import { useMemo, useEffect, useRef } from "react";
import Observable, {
    EventMap,
    GetEventHandlerArguments,
    GetEventHandlerReturnValue,
    ListenerFunction,
    ListenerOptions,
    MapKey,
} from "@kuindji/observable";
import {
    ObservableHookEventList,
    ObservableHookEventMap,
    ObservableHookEventSetting,
} from "../types";

function subscribe<Id extends MapKey>(
    o: Observable<Id>,
    list: ObservableHookEventList<Id>
) {
    list.forEach((entry) => {
        o.on && o.on(entry.name, entry.listener, entry.options);
    });
}

function unsubscribe<Id extends MapKey>(
    o: Observable<Id>,
    list: ObservableHookEventList<Id>
) {
    list.forEach((entry) => {
        o.un && o.un(entry.name, entry.listener, entry.options?.context);
    });
}

function findEventListEntryIndex<Id extends string | symbol>(
    list: ObservableHookEventList<Id>,
    entry: ObservableHookEventSetting<Id>
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

function getDiff<Id extends string | symbol>(
    a: ObservableHookEventList<Id>,
    b: ObservableHookEventList<Id>
): ObservableHookEventList<Id> {
    const c: ObservableHookEventList<Id> = [];

    a.forEach((entry) => {
        if (findEventListEntryIndex<Id>(b, entry) === -1) {
            c.push(entry);
        }
    });

    return c;
}

function useOn<
    O extends Observable | null,
    Id extends string | symbol = O extends Observable<infer Id_> ? Id_ : any,
    E_ extends
        | keyof EventMap[Id]
        | ObservableHookEventMap<Id>
        | ObservableHookEventList<Id> = keyof EventMap[Id],
    E extends MapKey = E_ extends keyof EventMap[Id] ? E_ : any
>(
    o: O,
    eventSetup: E_,
    listener?: ListenerFunction<
        GetEventHandlerArguments<Id, E>,
        GetEventHandlerReturnValue<Id, E>
    >,
    listenerOptions?: ListenerOptions<Id, E>
): void {
    if (typeof eventSetup === "string" && !listener) {
        throw new Error("Event listener is empty");
    }

    const list = useMemo<
        ObservableHookEventList<Id>
    >((): ObservableHookEventList<Id> => {
        if (Array.isArray(eventSetup)) {
            return eventSetup;
        }

        if (
            typeof eventSetup === "string" ||
            typeof eventSetup === "symbol" ||
            typeof eventSetup === "number"
        ) {
            return (<E extends keyof EventMap[Id]>(
                name: E
            ): ObservableHookEventList<Id> => [
                {
                    name: name as string | symbol,
                    listener: listener as unknown as ListenerFunction<
                        GetEventHandlerArguments<Id, E>,
                        GetEventHandlerReturnValue<Id, E>
                    >,
                    options: listenerOptions as ListenerOptions<Id, E>,
                },
            ])(eventSetup);
        }

        return Object.keys(eventSetup as ObservableHookEventMap<Id>).map(
            <K extends keyof EventMap[Id]>(name: K) => ({
                name,
                listener: eventSetup[
                    name as string | symbol
                ] as ListenerFunction<
                    GetEventHandlerArguments<Id, K>,
                    GetEventHandlerReturnValue<Id, K>
                >,
            })
        );
    }, [eventSetup, listener, listenerOptions]);

    const obsRef = useRef<Observable<Id> | null>(o as Observable<Id> | null);
    const currList = useRef<ObservableHookEventList<Id>>(list);
    const prevList = useRef<ObservableHookEventList<Id> | null>(null);

    currList.current = list;

    useEffect(() => {
        // need to synchronize
        if (obsRef.current) {
            if (prevList.current) {
                const oldEvents = getDiff<Id>(prevList.current, list);
                const newEvents = getDiff<Id>(list, prevList.current);
                unsubscribe<Id>(obsRef.current, oldEvents);
                subscribe<Id>(obsRef.current, newEvents);
            } else {
                subscribe<Id>(obsRef.current, list);
            }

            prevList.current = [...list];
        }
    }, [list]);

    useEffect(() => {
        if (obsRef.current === o) {
            return;
        } else {
            if (obsRef.current === null && o !== null) {
                obsRef.current = o as Observable<Id>;
                if (currList.current) {
                    subscribe<Id>(obsRef.current, currList.current);
                }
            } else if (obsRef.current !== null && o === null) {
                unsubscribe<Id>(obsRef.current, currList.current);
                obsRef.current = null;
            } else {
                if (currList.current) {
                    !!obsRef.current &&
                        unsubscribe<Id>(obsRef.current, currList.current);
                    !!o &&
                        subscribe<Id>(
                            o as unknown as Observable<Id>,
                            currList.current
                        );
                }
                obsRef.current = o as Observable<Id>;
            }
        }
    }, [o]);

    useEffect(
        () => () => {
            if (obsRef.current) {
                prevList.current = null;
                unsubscribe<Id>(obsRef.current, currList.current);
            }
        },
        []
    );
}

export default useOn;
