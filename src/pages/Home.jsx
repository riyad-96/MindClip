import { NoteSvg, TrashSvg, ZeroSvg } from '../components/Svgs';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';

function Home() {
  async function signout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function openSidebar() {
    setIsSidebarOpen(true);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-screen max-w-[1930px]">
        <div onClick={() => setIsSidebarOpen(false)} className={`fixed inset-0 z-9 bg-black/30 transition-opacity duration-400 md:hidden dark:bg-white/10 [@media(pointer:fine)]:backdrop-blur-[3px] ${isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}></div>
        <aside className={`h-full w-[250px] border-x-1 border-zinc-200 bg-zinc-50 transition-[translate] duration-400 max-md:fixed max-md:top-0 max-md:left-0 max-md:z-10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white ${isSidebarOpen ? 'translate-x-0' : 'max-md:translate-x-[-100%]'}`}>
          <div className="flex items-center justify-between p-3">
            <span onClick={() => window.location.reload()} className="cursor-pointer text-[length:clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)] font-medium select-none">
              ZeroNote
            </span>
            <button onClick={() => setIsSidebarOpen(false)} className="cursor-pointer active:scale-95 md:hidden">
              <ZeroSvg className="sidebar-svg" width="30" height="30" />
            </button>
          </div>

          <div className="grid gap-1.5 bg-zinc-100 p-3 dark:bg-zinc-800">
            <NavLink to="/home/notes" className={({ isActive }) => `flex h-[40px] items-center gap-2 rounded-md border-1 border-transparent px-3 transition-colors hover:border-zinc-300 hover:bg-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 ${isActive && 'border-zinc-300 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700'}`}>
              <NoteSvg width="18" height="18" />
              <span>Notes</span>
            </NavLink>
            <NavLink to="/home/trash" className={({ isActive }) => `flex h-[40px] items-center gap-2 rounded-md border-1 border-transparent px-3 transition-colors hover:border-zinc-300 hover:bg-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 ${isActive && 'border-zinc-300 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700'}`}>
              <TrashSvg width="20" height="20" />
              <span>Trash</span>
            </NavLink>
          </div>

          <div className="p-2">
            <button onClick={signout} className="cursor-pointer rounded-full bg-zinc-800 px-4 py-1 text-white">
              signout
            </button>
          </div>
        </aside>

        <main className="flex-1 border-r-1 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <Header func={{ openSidebar }} />
          <div className="h-[calc(100%_-_50px)] px-3">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
