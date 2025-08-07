import { useState, forwardRef } from 'react';

const Input = forwardRef(({ onChange, autoComplete, value, placeholder, type = 'text' }, ref) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  function setFocusState(isFocused) {
    if (isFocused) {
      setIsInputFocused(true);
    }
    if (!isFocused && !value.trim()) {
      setIsInputFocused(false);
    }
  }
  return (
    <div className="relative">
      <input ref={ref} onChange={onChange} value={value} autoComplete={autoComplete} onFocus={() => setFocusState(true)} onBlur={() => setFocusState(false)} type={type} className="peer block h-[50px] w-full min-w-0 rounded-full border-1 border-zinc-300 dark:border-zinc-700 px-6 transition-[border-color] duration-150 outline-none focus:border-[#5f82fe]" />
      <span className={`pointer-events-none absolute left-6 z-1 translate-y-[-50%] bg-zinc-50 dark:bg-zinc-900 px-1 text-sm tracking-wide text-zinc-400 transition-[top_font-size] duration-150 select-none peer-focus:text-[#5f82fe] ${isInputFocused ? 'top-0 text-xs' : 'top-[calc(50%_+_1px)]'}`}>{placeholder}</span>
    </div>
  );
});

export default Input;
