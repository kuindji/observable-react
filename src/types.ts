import Observable from "@kuindji/observable"
import { PropsWithChildren } from "react"
import { ListenerFunction, ListenerOptions } from "@kuindji/observable"

export type ObservableProviderProps = PropsWithChildren & {
    observable: Observable
}

export type ObservableHookEventMap = {
    [key: string]: ListenerFunction
};

export type ObservableHookEventSetting = {
    name: string,
    listener: ListenerFunction,
    options?: ListenerOptions
}

export type ObservableHookEventList = ObservableHookEventSetting[];