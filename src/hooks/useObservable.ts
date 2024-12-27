import { useContext, Context } from "react";
import ObservableContext from "../Context";
import Observable, { MapKey } from "@kuindji/observable";

function useObservable<Id extends MapKey>(
    ctx?: Context<Observable<Id> | null>
) {
    const context = useContext(ctx || ObservableContext);
    return context as Observable<Id> | null;
}

export default useObservable;
