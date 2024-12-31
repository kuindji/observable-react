import React, { ReactNode, Context } from "react";
import Observable, { BaseMap, MapKey } from "@kuindji/observable";
import ObservableContext from "./Context";

function ObservableProvider<
    O extends Observable<never, any>,
    Id extends MapKey | BaseMap = [O] extends [
        Observable<
            infer Id_ extends MapKey | BaseMap,
            infer Map_ extends BaseMap
        >
    ]
        ? Id_
        : never,
    Map extends BaseMap = [O] extends [
        Observable<
            infer Id_ extends MapKey | BaseMap,
            infer Map_ extends BaseMap
        >
    ]
        ? Map_
        : any
>({
    observable,
    children,
    context,
}: {
    observable: O;
    children: ReactNode;
    context: Context<Observable<Id, Map>> | null;
}): ReactNode {
    const Ctx: Context<Observable<Id, Map>> = (context ||
        ObservableContext) as unknown as Context<Observable<Id, Map>>;

    return <Ctx.Provider value={observable}>{children}</Ctx.Provider>;
}

export default ObservableProvider;
