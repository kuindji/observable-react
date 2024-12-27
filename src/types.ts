import { Context } from "react";
import Observable, {
    EventMap,
    MapKey,
    GetEventHandlerArguments,
    GetEventHandlerReturnValue,
} from "@kuindji/observable";
import { ListenerFunction, ListenerOptions } from "@kuindji/observable";

export type ObservableProviderProps<Id extends MapKey> = {
    observable: Observable<Id>;
    context?: Context<Observable<Id>>;
};

export type ObservableHookEventMap<Id extends MapKey> = {
    [E in keyof EventMap[Id]]: ListenerFunction<
        GetEventHandlerArguments<Id, E>,
        GetEventHandlerReturnValue<Id, E>
    >;
};

export type ObservableHookEventSetting<
    Id extends MapKey,
    E extends keyof EventMap[Id] = keyof EventMap[Id]
> = {
    name: E;
    listener: ListenerFunction<
        GetEventHandlerArguments<Id, E>,
        GetEventHandlerReturnValue<Id, E>
    >;
    options?: ListenerOptions<Id, E>;
};

export type ObservableHookEventList<Id extends MapKey> =
    ObservableHookEventSetting<Id>[];
