import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { isLoggedInContext, userContext } from './contexts/contexts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { LoaderSvg } from './components/Svgs';

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(isLoggedInContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/log-in', { replace: true });
    }
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser({});
        setIsLoggedIn(false);
        setIsLoaded(true);
        return;
      }
      setUser(currentUser);
      setIsLoggedIn(true);
      setIsLoaded(true);
    });

    return () => subscribe();
  }, [setIsLoggedIn, setUser]);

  return (
    <div className="font-[Poppins]">
      <div className={`fixed inset-0 z-[999] grid place-items-center bg-white ${isLoaded && 'site-loaded'}`}>
        <LoaderSvg className="animate-spin sm:size-[50px]" width="35" height="35" />
      </div>
      {isLoaded && <Outlet />}
    </div>
  );
}

export default App;
