import { Context } from "react";
import Observable, { MapKey, BaseMap } from "@kuindji/observable";

export type ObjectToUnionList<T> = T[keyof T][];

export type ObservableProviderProps<
    IdOrMap extends MapKey | BaseMap = never,
    Map extends BaseMap = any
> = {
    observable: Observable<IdOrMap, Map>;
    context?: Context<Observable<IdOrMap, Map>>;
};

// export type ObservableHookEventMap<Map extends BaseMap> = {
//     [E in keyof Map]: Map[E]["handler"];
// };
export type ObservableHookEventMap<Map extends BaseMap> = {
    [E in keyof Map]: Map[E]["handler"];
};

export type ObservableHookEventSetting<
    Map extends BaseMap,
    E extends MapKey & keyof Map = keyof Map
> = {
    name: E;
    listener: Map[E]["handler"];
    options?: Map[E]["listenerOptions"];
};

// export type ObservableHookEventList<
//     Map extends BaseMap,
//     MapWithName = {
//         [K in keyof Map]: {
//             name: K;
//             listener: Map[K]["handler"];
//             options: Map[K]["listenerOptions"];
//         };
//     }
// > = MapWithName[keyof MapWithName][];
// ObservableHookEventSetting<Map>[];

export type ObservableHookEventList<Map extends BaseMap> =
    ObservableHookEventSetting<Map>[];
