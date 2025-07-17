import { useCallback, useEffect, useState } from 'react';
import { useNotes, useUser } from '../contexts/contexts';

import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { LoaderSvg } from './Svgs';
import EachNote from './EachNote';

function Notes() {
  const { user } = useUser();
  const { notes, setNotes } = useNotes();
  const [noteIsLoading, setNoteIsLoading] = useState(true);

  //! FetchNotes
  const fetchUserNotes = useCallback(async () => {
    const noteCollectionRef = collection(db, 'users', user.uid, 'notes');

    try {
      const dbNote = await getDocs(noteCollectionRef);

      const notesArray = [];

      dbNote.forEach((doc) => {
        notesArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log(notesArray);
      setNotes(notesArray);
      setNoteIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [user.uid, setNotes]);

  useEffect(() => {
    if (user.uid) {
      fetchUserNotes();
    }
  }, [user.uid, fetchUserNotes]);

  return (
    <div className="">
      <h1 className="text-3xl font-medium">Notes</h1>
      <div className="border">{noteIsLoading ? <LoaderSvg /> : notes.map((note) => <EachNote key={note.id} note={note} />)}</div>
    </div>
  );
}

export default Notes;
