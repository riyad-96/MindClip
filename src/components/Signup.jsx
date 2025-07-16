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

      <div className="space-y-4">
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
          />
          <span className={`flex items-center gap-2 overflow-hidden text-xs tracking-wide text-red-500 transition-[height] duration-100 select-none ${passError ? 'h-[20px]' : 'h-0'}`}>
            <ErrorSvg />
            <span>{passError}</span>
          </span>

          <button onClick={() => setIsPasswordVisible((prev) => !prev)} className={`absolute top-1/2 right-2 grid size-[35px] translate-y-[-50%] cursor-pointer place-items-center rounded-full text-zinc-500 transition-opacity hover:bg-zinc-200 hover:text-zinc-800 ${signupPass.trim() ? '' : 'pointer-events-none opacity-0'}`}>
            {isPasswordVisible ? <OpenEyeSvg/> : <CloseEyeSvg />}
            <span className="absolute -inset-2 rounded-full [@media(pointer:fine)]:hidden"></span>
          </button>
        </div>

        <button onClick={handleSignup} className="h-[50px] w-full cursor-pointer grid place-items-center rounded-full bg-zinc-950 text-sm font-medium tracking-wide text-white hover:bg-zinc-800 active:bg-zinc-700">
          {tryingToSignup ? <LoaderSvg className='animate-spin' width="24" height="24" /> : <span>Continue</span>}
        </button>
      </div>
      <span className={`block overflow-hidden text-center select-none text-sm text-red-500 transition-[height_margin-top] duration-100 ${signupError ? 'mt-4 h-[20px]' : 'mt-0 h-0'}`}>{signupError}</span>

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

function errorSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>
    </svg>
  );
}

function openEyeSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path>
    </svg>
  );
}

function closeEyeSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path>
    </svg>
  );
}

function loaderSvg() {
  return (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M18.364 5.63604L16.9497 7.05025C15.683 5.7835 13.933 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H21C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.4853 3 16.7353 4.00736 18.364 5.63604Z"></path>
    </svg>
  );
}