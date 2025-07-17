import { createContext, useContext, useState } from 'react';
const userContext = createContext();

function UserContextProvider({children}) {
  const [user, setUser] = useState({})
  return (
    <userContext.Provider value={{user, setUser}}>
      {children}
    </userContext.Provider>
  )
}

export default UserContextProvider;

export function useUser() {
  return useContext(userContext);
}