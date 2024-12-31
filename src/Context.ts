import { createContext } from "react";
import Observable from "@kuindji/observable";

const ObservableContext = createContext<Observable<never, any> | null>(null);

export default ObservableContext;
