import React, { ReactNode, PropsWithChildren } from "react"
import ObservableContext from "./Context"

import type { ObservableProviderProps } from "./types"

function ObservableProvider(props: PropsWithChildren<ObservableProviderProps>): ReactNode {

    const { observable, children, context } = props;

    const Context = context || ObservableContext;
    
    return (
        <Context.Provider value={ observable }>
            { children }
        </Context.Provider>
    );
};

export default ObservableProvider