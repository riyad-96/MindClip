import { createContext, useContext, useState } from 'react';
const placeholderContext = createContext();

function ContextPlaceholder({children}) {
  const [placeholder, setPlaceholder] = useState({})
  return (
    <placeholderContext.Provider value={{placeholder, setPlaceholder}}>
      {children}
    </placeholderContext.Provider>
  )
}

export default ContextPlaceholder;

export function usePlaceholder() {
  return useContext(placeholderContext);
}