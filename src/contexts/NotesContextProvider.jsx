import { createContext, useContext, useState } from 'react';
const notesContext = createContext();

function NotesContextProvider({children}) {
  const [notes, setNotes] = useState([]);
  return (
    <notesContext.Provider value={{notes, setNotes}}>
      {children}
    </notesContext.Provider>
  )
}

export default NotesContextProvider;

export function useNotes() {
  return useContext(notesContext);
}