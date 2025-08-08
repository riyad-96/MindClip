import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useIsLoggedIn, useUser } from './contexts/contexts';
import { AnimatePresence, motion } from 'motion/react';
import { LoaderSvg } from './components/Svgs';

function App() {
  const { isLoggedIn, setIsLoggedIn, isLoaded, setIsLoaded } = useIsLoggedIn();

  const navigate = useNavigate();
  const { setUser } = useUser();

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
  }, [setIsLoggedIn, setUser, setIsLoaded, navigate]);

  useEffect(() => {
    if (!isLoaded) return;

    if (isLoggedIn) {
      navigate('/home/notes', { replace: true });
    } else {
      navigate('/auth/log-in', { replace: true });
    }
  }, [isLoaded, isLoggedIn, navigate]);

  return (
    <div className="overflow-hidden transition-colors bg-zinc-50 dark:bg-zinc-900 dark:text-white font-[Poppins]">
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <motion.div
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              opacity: { duration: 0.2 },
            }}
            className="fixed inset-0 z-[999] grid place-items-center bg-zinc-50 dark:bg-zinc-900 dark:text-white"
          >
            <LoaderSvg className="size-[35px] animate-spin md:size-[45px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {isLoaded && <Outlet />}
    </div>
  );
}

export default App;
