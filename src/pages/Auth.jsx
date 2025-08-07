import { Outlet } from 'react-router-dom';

function Auth() {
  return (
    <div className="relative h-screen min-h-screen">
      <div className="grid min-h-full content-center justify-items-center overflow-y-auto py-16">
        <span className="block text-2xl font-semibold md:absolute md:top-4 md:left-4">ZeroNote</span>
        <div className="box-content w-full max-w-[340px] px-6 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Auth;
