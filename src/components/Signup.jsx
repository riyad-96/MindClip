import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from './Input';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { CloseEyeSvg, ErrorSvg, LoaderSvg, OpenEyeSvg } from './Svgs';

function Signup() {
  const signupEmailInputRef = useRef(null);
  const signupPassInputRef = useRef(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    signupEmailInputRef.current.focus();
  }, []);

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');

  // const { setIsLoggedIn } = useContext(isLoggedInContext);

  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (emailError) {
      signupEmailInputRef.current.classList.add('error-state');
    } else {
      signupEmailInputRef.current.classList.remove('error-state');
    }
    if (passError) {
      signupPassInputRef.current.classList.add('error-state');
    } else {
      signupPassInputRef.current.classList.remove('error-state');
    }
  }, [emailError, passError]);

  function isAbleToSignUp() {
    let ableToSignup = true;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    function checkEmail() {
      if (!signupEmail) {
        setEmailError('Email is required');
        ableToSignup = false;
        return;
      } else if (!emailRegex.test(signupEmail)) {
        setEmailError('Insert a valid email');
        ableToSignup = false;
        return;
      } else {
        setEmailError('');
      }
    }
    checkEmail();

    const minPassLength = 6;
    function checkPass() {
      if (!signupPass) {
        setPassError('Password is required');
        ableToSignup = false;
        return;
      } else if (signupPass.length < minPassLength) {
        setPassError(`Password must be minimum ${minPassLength} chars.`);
        ableToSignup = false;
        return;
      } else {
        setPassError('');
      }
    }
    checkPass();

    if (ableToSignup) {
      return true;
    } else {
      return false;
    }
  }

  //! Actual signup program
  const [signupError, setSignupError] = useState('');
  const [tryingToSignup, setTryingToSignup] = useState(false);

  async function handleSignup() {
    const ableToSignup = isAbleToSignUp();
    if (!ableToSignup) return;

    setTryingToSignup(true);
    setSignupError('');

    try {
      const user = await createUserWithEmailAndPassword(auth, signupEmail, signupPass);
      console.log(user);
    } catch (error) {
      console.error(error.code);
      if (error.code === 'auth/email-already-in-use') {
        setSignupError('Email already in use.');
      } else {
        setSignupError('Sign up failed.');
      }
      setTryingToSignup(false);
    }
  }

  return (
    <div>
      {tryingToSignup && <div className="fixed inset-0 z-999 cursor-not-allowed bg-white/50"></div>}
      <h2 className="mb-8 text-center text-[1.625rem] font-medium">Create an account</h2>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <Input
            ref={signupEmailInputRef}
            value={signupEmail}
            onChange={(e) => {
              setSignupEmail(e.target.value);
              setEmailError('');
            }}
            type="email"
            placeholder="Email address"
            autoComplete="username"
          />
          <span className={`flex items-center gap-2 overflow-hidden text-xs tracking-wide text-red-500 transition-[height] duration-100 select-none ${emailError ? 'h-[20px]' : 'h-0'}`}>
            <ErrorSvg />
            <span>{emailError}</span>
          </span>
        </div>

        <div className="relative">
          <Input
            ref={signupPassInputRef}
            value={signupPass}
            onChange={(e) => {
              setSignupPass(e.target.value);
              setPassError('');
            }}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Password"
            autoComplete="current-password"
          />
          <span className={`flex items-center gap-2 overflow-hidden text-xs tracking-wide text-red-500 transition-[height] duration-100 select-none ${passError ? 'h-[20px]' : 'h-0'}`}>
            <ErrorSvg />
            <span>{passError}</span>
          </span>

          <button onClick={() => setIsPasswordVisible((prev) => !prev)} className={`absolute top-[1.5rem] right-2 grid size-[35px] translate-y-[-50%] cursor-pointer place-items-center rounded-full text-zinc-500 transition-opacity hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 ${signupPass.trim() ? '' : 'pointer-events-none opacity-0'}`}>
            {isPasswordVisible ? <OpenEyeSvg /> : <CloseEyeSvg />}
            <span className="absolute -inset-2 rounded-full [@media(pointer:fine)]:hidden"></span>
          </button>
        </div>

        <button onClick={handleSignup} className="grid h-[50px] w-full cursor-pointer place-items-center rounded-full bg-zinc-950 text-sm font-medium tracking-wide text-white hover:bg-zinc-800 active:bg-zinc-700">
          {tryingToSignup ? <LoaderSvg className="animate-spin" width="24" height="24" /> : <span>Continue</span>}
        </button>
      </form>
      <span className={`block overflow-hidden text-center text-sm text-red-500 transition-[height_margin-top] duration-100 select-none ${signupError ? 'mt-4 h-[20px]' : 'mt-0 h-0'}`}>{signupError}</span>

      <div className="my-7 flex justify-center gap-1 text-center text-sm">
        <span>Already have an account?</span>
        <Link to="/auth/log-in" className="text-[#3e68fe] hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}

export default Signup;