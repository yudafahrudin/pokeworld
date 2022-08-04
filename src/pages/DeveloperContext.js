import React, { createContext } from "react";

const DeveloperContext = createContext();

function DeveloperProvider({ children }) {
    return (
        <DeveloperContext.Provider value={{
            developer: "yuda",
            version: "1.9.0"
        }} >
            {children}
        </DeveloperContext.Provider>
    )

}

export { DeveloperProvider, DeveloperContext }
