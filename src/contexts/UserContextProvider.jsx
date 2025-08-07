import { createContext, useContext, useState } from 'react';
const userContext = createContext();

function UserContextProvider({ children }) {
  const [user, setUser] = useState({});

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const theme = localStorage.getItem('theme');
    if (theme && theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    return theme && theme === 'dark' ? true : false;
  });

  return <userContext.Provider value={{ user, setUser, isTouchDevice, isDarkTheme, setIsDarkTheme }}>{children}</userContext.Provider>;
}

export default UserContextProvider;

export function useUser() {
  return useContext(userContext);
}
