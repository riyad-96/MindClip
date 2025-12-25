import { NoteSvg, TrashSvg, ZeroSvg } from '../components/Svgs';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { useState } from 'react';
import { useUser } from '../contexts/UserContextProvider';

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isActivityDisabled } = useUser();

  function openSidebar() {
    setIsSidebarOpen(true);
  }

  return (
    <div className="min-height-dvh">
      {isActivityDisabled && <div className="fixed inset-0 z-[1000] cursor-not-allowed bg-white/30 dark:bg-white/10"></div>}
      <div className="height-dvh mx-auto flex max-w-[1230px]">
        <div onClick={() => setIsSidebarOpen(false)} className={`fixed inset-0 z-9 bg-black/30 transition-opacity duration-400 md:hidden dark:bg-white/10 [@media(pointer:fine)]:backdrop-blur-[3px] ${isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}></div>
        <aside className={`h-full w-[250px] border-r border-zinc-200 bg-zinc-50 transition-[translate,background-color,border-color] duration-[400ms,150ms,150ms] max-md:fixed max-md:top-0 max-md:left-0 max-md:z-10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white ${isSidebarOpen ? 'translate-x-0' : 'max-md:translate-x-[-100%]'}`}>
          <div className="flex items-center justify-between p-3">
            <span onClick={() => window.location.reload()} className="cursor-pointer text-[clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)] font-medium select-none">
              MindClip
            </span>
            <button onClick={() => setIsSidebarOpen(false)} className="cursor-pointer active:scale-95 md:hidden">
              <ZeroSvg className="sidebar-svg" width="30" height="30" />
            </button>
          </div>

          <div className="grid gap-1.5 bg-zinc-100 p-3 transition-[background-color] duration-150 dark:bg-zinc-800">
            <NavLink to="/" className={({ isActive }) => `flex h-10 items-center gap-2 rounded-md border border-transparent px-3 transition-colors duration-150 hover:border-zinc-300 hover:bg-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 ${isActive && 'border-zinc-300 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700'}`}>
              <NoteSvg width="18" height="18" />
              <span>Notes</span>
            </NavLink>
            <NavLink to="/trash" className={({ isActive }) => `flex h-10 items-center gap-2 rounded-md border border-transparent px-3 transition-colors duration-150 hover:border-zinc-300 hover:bg-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 ${isActive && 'border-zinc-300 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700'}`}>
              <TrashSvg width="20" height="20" />
              <span>Trash</span>
            </NavLink>
          </div>
        </aside>

        <main className="flex-1 border-zinc-200 bg-zinc-50 transition-colors duration-150 dark:border-zinc-800 dark:bg-zinc-900">
          <Header func={{ openSidebar }} />
          <div className="h-[calc(100%-50px)] px-3">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
