import { Context } from "react"
import Observable from "@kuindji/observable"
import { ListenerFunction, ListenerOptions } from "@kuindji/observable"

export type ObservableProviderProps = {
    observable: Observable,
    context?: Context<Observable>
};

export type ObservableHookEventMap = {
    [key: string]: ListenerFunction
};

export type ObservableHookEventSetting = {
    name: string,
    listener: ListenerFunction,
    options?: ListenerOptions
};

export type ObservableHookEventList = ObservableHookEventSetting[];