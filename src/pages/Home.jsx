import { NoteSvg, TrashSvg, ZeroSvg } from '../components/Svgs';
import { NavLink, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

function Home() {
  async function signout() {
    await signOut(auth);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex h-screen max-w-[1930px]">
        <aside className="h-full w-[250px] border-x-1 border-zinc-200 bg-zinc-50">
          <div className="flex items-center justify-between p-3">
            <span className="text-[length:clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)]">ZeroNote</span>
            <button className="md:hidden">
              <ZeroSvg width="30" height="30" />
            </button>
          </div>

          <div className="grid gap-1 bg-zinc-100 p-3">
            <NavLink to="/notes" className={({ isActive }) => `flex h-[40px] items-center gap-2 rounded-md border-1 border-transparent px-3 transition-colors hover:border-zinc-300 hover:bg-zinc-200 ${isActive && 'border-zinc-300 bg-zinc-200'}`}>
              <NoteSvg width="18" height="18" />
              <span>Notes</span>
            </NavLink>
            <NavLink to="/trash" className={({ isActive }) => `flex h-[40px] items-center gap-2 rounded-md border-1 border-transparent px-3 transition-colors hover:border-zinc-300 hover:bg-zinc-200 ${isActive && 'border-zinc-300 bg-zinc-200'}`}>
              <TrashSvg width="20" height="20" />
              <span>Trash</span>
            </NavLink>
          </div>
          <button onClick={signout} className="cursor-pointer rounded-full bg-zinc-800 px-4 py-1 text-white">
            signout
          </button>
        </aside>

        <main className="flex-1 border-r-1 border-zinc-200 bg-zinc-50">
          <Header />
          <div className="h-[calc(100%_-_50px)] px-3">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
