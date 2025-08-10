import { MoonSvg, ProfileSvg, SunSvg, ZeroSvg } from './Svgs';
import { AnimatePresence, motion } from 'motion/react';
import { useUser } from '../contexts/UserContextProvider';
import { useEffect, useRef, useState } from 'react';
import Profile from './Profile';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

function Header({ func }) {
  const { openSidebar } = func;

  const { user, isDarkTheme, setIsDarkTheme, isProfileLoaded, setIsProfileLoaded, profileData, setProfileData } = useUser();

  function switchTheme() {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(newTheme === 'dark');
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme === 'dark' ? 'dark' : 'light');
  }

  // profile card coords
  const profileContainer = useRef(null);
  const [profileModalCoord, setProfileModalCoord] = useState(null);

  function profileModalCoordFunc(e) {
    if (profileModalCoord) {
      setProfileModalCoord(null);
      return;
    }
    const { right, bottom } = e.target.getBoundingClientRect();
    console.log(right, bottom);
    setProfileModalCoord({
      right: window.innerWidth - right - 1,
      bottom: bottom + 2,
    });
  }

  useEffect(() => {
    if (!profileModalCoord) return;

    function handleResize() {
      const { right, bottom } = profileContainer.current.getBoundingClientRect();
      setProfileModalCoord({
        right: window.innerWidth - right,
        bottom,
      });
    }

    function handleClickOutsideProfile(e) {
      if (e.target.closest('.profile-card')) return;

      const headerProfileContainer = e.target.closest('.profile-container');
      if (profileModalCoord && !headerProfileContainer) {
        setProfileModalCoord(null);
      }
    }

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutsideProfile);
    document.addEventListener('touchstart', handleClickOutsideProfile);
  }, [profileModalCoord]);

  //! Load profile data

  useEffect(() => {
    async function getProfileData() {
      const docRef = doc(db, 'users', user.uid, 'profile', 'info');

      try {
        const savedInfo = await getDoc(docRef);
        if (!savedInfo.exists()) {
          const toSave = {
            name: 'Guest',
            imgUrl: '',
          };
          await setDoc(docRef, toSave);
          setProfileData(toSave);
        } else {
          setProfileData({ ...savedInfo.data() });
        }

        setIsProfileLoaded(true);
      } catch (error) {
        setIsProfileLoaded(true);
        console.error(error);
      }
    }

    getProfileData();
  }, [user.uid, setIsProfileLoaded, setProfileData]);

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

        <div ref={profileContainer} onClick={profileModalCoordFunc} className={`profile-container relative size-[30px] cursor-pointer rounded-full outline-2 outline-offset-2 outline-transparent transition-[color,background-color,scale,outline-color] duration-[150ms,150ms,350ms,300ms] [@media(pointer:fine)]:hover:scale-[0.9] [@media(pointer:fine)]:hover:outline-zinc-400`}>
          <div className="size-full overflow-hidden rounded-full">{profileData?.imgUrl ? <img src={profileData.imgUrl} alt="Profile picture" /> : <ProfileSvg className="size-full fill-zinc-800 transition-colors duration-150 dark:fill-zinc-200" />}</div>
        </div>

        <AnimatePresence>{profileModalCoord && <Profile coords={profileModalCoord} func={{ setProfileModalCoord }} />}</AnimatePresence>
      </div>
    </header>
  );
}

export default Header;
