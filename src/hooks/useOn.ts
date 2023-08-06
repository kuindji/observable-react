import { useMemo, useEffect, useRef } from "react"
import Observable, { ListenerFunction, ListenerOptions } from "@kuindji/observable"
import { ObservableHookEventList, ObservableHookEventMap, ObservableHookEventSetting } from "../types"



function subscribe(o: Observable, list: ObservableHookEventList) {
    list.forEach(entry => {
        o.on(entry.name, entry.listener, entry.options);
    })
};

function unsubscribe(o: Observable, list: ObservableHookEventList) {
    list.forEach(entry => {
        o.un(entry.name, entry.listener, entry.options?.context);
    })
};

function findEventListEntryIndex(list: ObservableHookEventList, entry: ObservableHookEventSetting) {
    return list.findIndex(e => {
        if (e.name !== entry.name) {
            return false;
        }
        if (e.listener !== entry.listener) {
            return false;
        }
        if (!!e.options?.context && 
                !!entry.options?.context && 
                e.options.context !== entry.options.context) {
            return false;
        }
        return true;
    });
};

function getOldSubscriptions(prevList: ObservableHookEventList, 
                            newList: ObservableHookEventList): ObservableHookEventList {
    const old: ObservableHookEventList = [];

    prevList.forEach(entry => {
        if (findEventListEntryIndex(newList, entry) === -1) {
            old.push(entry);
        }
    });

    return old;
};

function useOn(o: Observable | null, 
                eventName: string | ObservableHookEventMap | ObservableHookEventList, 
                listener?: ListenerFunction, 
                listenerOptions?: ListenerOptions) {

    if (typeof eventName === "string" && !listener) {
        throw new Error("Event listener is empty");
    }

    const list = <ObservableHookEventList>useMemo(
        () => {
            if (Array.isArray(eventName)) {
                return eventName;
            }
            if (typeof eventName === "string") {
                return [{
                    name: eventName,
                    listener,
                    options: listenerOptions
                }]
            }

            return Object.keys(eventName).map(name => ({ name, listener: eventName[name] }));
        },
        [ eventName, listener, listenerOptions ]
    );

    const obsRef = useRef<Observable | null>(o);
    const currList = useRef<ObservableHookEventList>(list);
    const prevList = useRef<ObservableHookEventList | null>(null);

    currList.current = list;

    
    useEffect(
        () => {
            // need to synchronizes
            if (obsRef.current) {
                if (prevList.current) {
                    const oldEvents = getOldSubscriptions(prevList.current, list);
                    unsubscribe(obsRef.current, oldEvents);
                }
                else {
                    subscribe(obsRef.current, list);
                }
                prevList.current = list;
            }
        },
        [ list ]
    );

    useEffect(
        () => {
            if (!obsRef.current && o) {
                obsRef.current = o;
                if (currList.current) {
                    subscribe(obsRef.current, currList.current);
                }
            }
            else if (obsRef.current && !o) {
                unsubscribe(obsRef.current, currList.current);
                obsRef.current = null;
            }
            else {
                throw new Error("Cannot change Observable object");
            }
        },
        [ o ]
    );

    useEffect(
        () => () => {
            if (obsRef.current) {
                unsubscribe(obsRef.current, currList.current);
            }
        },
        []
    );
};

export default useOn