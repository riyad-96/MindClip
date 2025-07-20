import { createContext, useContext, useState } from 'react';
const notesContext = createContext();

function NotesContextProvider({children}) {
  const [notes, setNotes] = useState([]);
  const [trashes, setTrashes] = useState([]);
  return (
    <notesContext.Provider value={{notes, setNotes, trashes, setTrashes}}>
      {children}
    </notesContext.Provider>
  )
}

export default NotesContextProvider;

export function useNotes() {
  return useContext(notesContext);
}