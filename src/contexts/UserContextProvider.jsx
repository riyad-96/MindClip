import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
const userContext = createContext();

function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [appLoaded, setAppLoaded] = useState(false);
  const [isActivityDisabled, setIsActivityDisabled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setAppLoaded(true);
        return;
      }
      setUser(currentUser);
      setAppLoaded(true);
    });

    return unsubscribe;
  }, []);

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
      if (!localStorage.theme && !isDark) {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  //! Profile
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [profileData, setProfileData] = useState({});

  return <userContext.Provider value={{ user, setUser, appLoaded, isActivityDisabled, setIsActivityDisabled, isTouchDevice, isDarkTheme, setIsDarkTheme, isProfileLoaded, setIsProfileLoaded, profileData, setProfileData }}>{children}</userContext.Provider>;
}

export default UserContextProvider;

export function useUser() {
  return useContext(userContext);
}
