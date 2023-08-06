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

function getDiff(a: ObservableHookEventList, b: ObservableHookEventList): ObservableHookEventList {
    const c: ObservableHookEventList = [];

    a.forEach(entry => {
        if (findEventListEntryIndex(b, entry) === -1) {
            c.push(entry);
        }
    });

    return c;
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
            // need to synchronize
            if (obsRef.current) {
                if (prevList.current) {
                    const oldEvents = getDiff(prevList.current, list);
                    const newEvents = getDiff(list, prevList.current);
                    unsubscribe(obsRef.current, oldEvents);
                    subscribe(obsRef.current, newEvents);
                }
                else {
                    subscribe(obsRef.current, list);
                }
                
                prevList.current = [ ...list ];
            }
        },
        [ list ]
    );

    useEffect(
        () => {
            if (obsRef.current === o) {
                return;
            }
            else {
                if (obsRef.current === null && o !== null) {
                    obsRef.current = o;
                    if (currList.current) {
                        subscribe(obsRef.current, currList.current);
                    }
                }
                else if (obsRef.current !== null && o === null) {
                    unsubscribe(obsRef.current, currList.current);
                    obsRef.current = null;
                }
                else {
                    if (currList.current) {
                        !!obsRef.current && unsubscribe(obsRef.current, currList.current);
                        !!o && subscribe(o, currList.current);
                    }
                    obsRef.current = o;
                }
            }
        },
        [ o ]
    );

    useEffect(
        () => () => {
            if (obsRef.current) {
                prevList.current = null;
                unsubscribe(obsRef.current, currList.current);
            }
        },
        []
    );
};

export default useOn