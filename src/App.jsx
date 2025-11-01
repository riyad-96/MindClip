import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { LoaderSvg } from './components/Svgs';
import { useUser } from './contexts/UserContextProvider';

function App() {
  const { appLoaded } = useUser();

  return (
    <div className="overflow-hidden bg-zinc-50 font-[Poppins] transition-colors dark:bg-zinc-900 dark:text-white">
      <AnimatePresence mode="wait">
        {!appLoaded && (
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

      {appLoaded && <Outlet />}
    </div>
  );
}

export default App;
