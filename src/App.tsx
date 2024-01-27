import React from "react";
import GlobalStyle from "./styles/GlobalStyle";
import "typeface-montserrat";
import "typeface-lato";
import { themeObject } from "./styles/themes/themeVariables";
import type { GlobalStore } from "./globalStore";
import globalStore from "./globalStore";

import POC from "./components/POC";

export const AppContext = React.createContext(globalStore);

const App: React.FC<{ store: GlobalStore }> = ({ store }) => {
  return (
    <AppContext.Provider value={store}>
      <meta
        name="theme-color"
        content={themeObject[store.colorScheme].primary}
      />
      <GlobalStyle />
      <POC store={store} />
    </AppContext.Provider>
  );
};

export default App;
