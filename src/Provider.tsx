import React, { ReactNode } from "react"
import ObservableContext from "./Context"

import type { ObservableProviderProps } from "./types"

function ObservableProvider(props: ObservableProviderProps): ReactNode {

    const { observable, children } = props;
    
    return (
        <ObservableContext.Provider value={ observable }>
            { children }
        </ObservableContext.Provider>
    );
}


export default ObservableProvider