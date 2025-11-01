import { addDoc, Timestamp } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
const notesContext = createContext();

function NotesContextProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [trashes, setTrashes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);

  // Add note to database
  async function addNoteToDatabase({ notesCollectionRef, databaseNote }) {
    try {
      const addedNote = await addDoc(notesCollectionRef, databaseNote);
      const newNoteId = addedNote.id;

      const localNote = {
        ...databaseNote,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        id: newNoteId,
      };

      setNotes((prev) => [localNote, ...prev]);
    } catch (err) {
      console.log(err);
    }
  }

  return <notesContext.Provider value={{ notes, setNotes, notesLoading, setNotesLoading, addNoteToDatabase, trashes, setTrashes }}>{children}</notesContext.Provider>;
}

export default NotesContextProvider;

export function useNotes() {
  return useContext(notesContext);
}
