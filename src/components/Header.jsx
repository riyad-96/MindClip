import { MoonSvg, SunSvg, ZeroSvg } from './Svgs';
import { AnimatePresence, motion } from 'motion/react';
import { useUser } from '../contexts/UserContextProvider';
import { useEffect } from 'react';

function Header({ func }) {
  const { openSidebar } = func;

  const { isDarkTheme, setIsDarkTheme } = useUser();

  function switchTheme() {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(newTheme === 'dark');
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme === 'dark' ? 'dark' : 'light');
  }

  return (
    <header className="flex h-[50px] items-center justify-between border-b-1 border-zinc-200 px-3 transition-[border-color] duration-150 dark:border-zinc-800">
      <div className="flex items-center gap-4">
        <button onClick={openSidebar} className="cursor-pointer active:scale-95 md:hidden">
          <ZeroSvg className="sidebar-svg" width="30" height="30" />
        </button>
        <span className="font-medium max-md:text-[length:clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)]">ZeroNote</span>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={switchTheme} className="h-[25px] w-[45px] cursor-pointer rounded-full border border-zinc-200 bg-zinc-100 p-0.5 transition-colors duration-150 dark:border-zinc-700 dark:bg-zinc-800">
          <span className={`relative grid h-full w-1/2 place-items-center overflow-hidden rounded-full bg-zinc-200 transition-[translate,background-color] duration-[300ms,150ms] dark:bg-zinc-700 ${isDarkTheme ? 'translate-x-full' : 'translate-x-0'}`}>
            <AnimatePresence>
              {isDarkTheme && (
                <motion.span
                  initial={{
                    y: '-100%',
                  }}
                  animate={{
                    y: 0,
                  }}
                  exit={{
                    y: '100%',
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="absolute inset-0 grid size-full place-items-center"
                >
                  <SunSvg width="12" height="12" />
                </motion.span>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!isDarkTheme && (
                <motion.span
                  initial={{
                    y: '-100%',
                  }}
                  animate={{
                    y: 0,
                  }}
                  exit={{
                    y: '100%',
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="absolute inset-0 grid size-full place-items-center"
                >
                  <MoonSvg width="12" height="12" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>

        <div className="size-[30px] rounded-full bg-zinc-300 cursor-pointer outline-2 outline-transparent hover:outline-zinc-300 transition-colors duration-150 outline-offset-2">
          
        </div>
      </div>
    </header>
  );
}

export default Header;
