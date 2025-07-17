import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { LoaderSvg } from './components/Svgs';
import { useIsLoggedIn, useUser } from './contexts/contexts';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/log-in', { replace: true });
    }
    if (isLoggedIn) {
      navigate('/notes', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const { user, setUser } = useUser();

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
    <div className="font-[Poppins] bg-zinc-50">
      <div className={`fixed inset-0 z-[999] grid place-items-center bg-white ${isLoaded && 'site-loaded'}`}>
        <LoaderSvg className="animate-spin sm:size-[50px]" width="35" height="35" />
      </div>
      {isLoaded && <Outlet />}
    </div>
  );
}

export default App;
