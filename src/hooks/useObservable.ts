import { useContext, Context } from "react"
import ObservableContext from "../Context"
import Observable from "@kuindji/observable"

function useObservable(ctx?: Context<Observable | null>) {
    const context = useContext(ctx || ObservableContext);
    return context;
}

export default useObservable