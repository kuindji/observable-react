import { useContext, Context } from "react";
import ObservableContext from "../Context";
import Observable, { BaseMap, MapKey } from "@kuindji/observable";

function useObservable<
    IdOrMap extends MapKey | BaseMap = never,
    Map extends BaseMap = any
>(ctx?: Context<Observable<IdOrMap, Map> | null>) {
    const context = useContext(ctx || ObservableContext);
    return context as Observable<IdOrMap, Map> | null;
}

export default useObservable;
