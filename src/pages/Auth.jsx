import { Outlet } from 'react-router-dom';
import { auth, googleAuth } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { GoogleIconSvg } from '../components/Svgs';

function Auth() {
  const [loginError, setLoginError] = useState('');
  const [tryingToLogin, setTryingToLogin] = useState(false);

  async function handleGoogleAuth() {
    setTryingToLogin(true);
    try {
      await signInWithPopup(auth, googleAuth);
    } catch (error) {
      console.error(error);
      setTryingToLogin(false);
    }
  }

  return (
    <div className="h-screen min-h-screen">
      {tryingToLogin && <div className="fixed inset-0 z-999 cursor-not-allowed bg-white/50"></div>}
      <div className="grid min-h-full content-center justify-items-center overflow-y-auto py-16">
        <span className="block text-2xl font-semibold md:fixed md:top-4 md:left-4">ZeroNote</span>
        <div className="box-content w-full max-w-[340px] px-6 py-8">
          <Outlet />

          <div className="flex items-center justify-between">
            <div className="h-[1px] w-[calc(50%_-_25px)] bg-zinc-200"></div>
            <span className="text-sm font-medium">OR</span>
            <div className="h-[1px] w-[calc(50%_-_25px)] bg-zinc-200"></div>
          </div>

          <div className="mt-8">
            <button onClick={handleGoogleAuth} className="flex h-[50px] w-full cursor-pointer items-center gap-4 rounded-full border-1 border-zinc-300 px-6 text-zinc-600 hover:bg-zinc-100 active:opacity-80">
              <GoogleIconSvg />
              <span>Continue with Google</span>
            </button>
            <span className={`block overflow-hidden mt-4 text-center text-sm text-red-500 transition-[height_margin-top] duration-100 ${loginError ? 'h-[20px] mt-4' : 'h-0 mt-0'}`}>Login failed. try again.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
