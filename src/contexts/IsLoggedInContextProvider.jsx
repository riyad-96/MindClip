import { createContext, useContext, useState } from 'react';
const isLoggedInContext = createContext();

function IsLoggedInContextProvider({children}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <isLoggedInContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
      {children}
    </isLoggedInContext.Provider>
  )
}

export default IsLoggedInContextProvider;

export function useIsLoggedIn() {
  return useContext(isLoggedInContext);
}