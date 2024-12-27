import React, { ReactNode, Context } from "react";
import Observable, { MapKey } from "@kuindji/observable";
import ObservableContext from "./Context";

function ObservableProvider<
    O extends Observable,
    Id_ extends MapKey = O extends Observable<infer Id> ? Id : MapKey,
    Id extends MapKey = Id_
>({
    observable,
    children,
    context,
}: {
    observable: O;
    children: ReactNode;
    context: Context<Observable<Id>> | null;
}): ReactNode {
    const Ctx: Context<Observable<Id>> = (context ||
        ObservableContext) as unknown as Context<Observable<Id>>;

    return <Ctx.Provider value={observable}>{children}</Ctx.Provider>;
}

export default ObservableProvider;
