import { useContext } from "react"
import ObservableContext from "../Context"

function useObservable() {
    const context = useContext(ObservableContext);
    return context;
}

export default useObservable