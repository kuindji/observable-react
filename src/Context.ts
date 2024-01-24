import { createContext } from "react"
import Observable from "@kuindji/observable";

const ObservableContext = createContext<Observable | null>(null);

export default ObservableContext;