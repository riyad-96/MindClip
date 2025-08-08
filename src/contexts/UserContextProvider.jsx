import { createContext, useContext, useEffect, useState } from 'react';
const userContext = createContext();

function UserContextProvider({ children }) {
  const [user, setUser] = useState({});

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.theme;
    if (isDark && !saved) {
      document.documentElement.classList.add('dark');
      return true;
    }
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      return true;
    } else {
      document.documentElement.classList.remove('dark');
      return false;
    }
  });

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!localStorage.theme && isDark) {
        document.documentElement.classList.add('dark');
      }
      if(!localStorage.theme && !isDark) {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  return <userContext.Provider value={{ user, setUser, isTouchDevice, isDarkTheme, setIsDarkTheme }}>{children}</userContext.Provider>;
}

export default UserContextProvider;

export function useUser() {
  return useContext(userContext);
}
