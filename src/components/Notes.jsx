import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotes, useUser } from '../contexts/contexts';

import { db } from '../config/firebase';
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
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
      const notesQuery = query(noteCollectionRef, orderBy('createdAt', 'desc'));
      const dbNote = await getDocs(notesQuery);

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

  //! add notes
  async function handleAddNote() {
    const notesCollectionRef = collection(db, 'users', user.uid, 'notes');

    const databaseNote = {
      title: 'title',
      text: 'amar notun note',
      createdAt: serverTimestamp(),
    };

    try {
      const addedNote = await addDoc(notesCollectionRef, databaseNote);
      const newNoteId = addedNote.id;

      const localNote = {
        id: newNoteId,
        title: 'title',
        text: 'amar notun note',
      };
      setNotes((prev) => [localNote, ...prev]);
    } catch (error) {
      console.error(error);
    }
  }

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [isOptionContextOpen, setIsOptionContextOpen] = useState(false);
  const [onContextSelectedNoteId, setOnContextSelectedNoteId] = useState('');
  const contextRef = useRef(null);

  function setContextMenu({ clientX, clientY, id, e }) {
    const menu = contextRef.current;
    menu.style.display = 'unset';
    const minRight = window.innerWidth - e.clientX;
    const { width } = menu.getBoundingClientRect();

    if (minRight < 140) {
      menu.style.left = `${clientX - width}px`;
      menu.style.top = `${clientY}px`;
    } else {
      menu.style.left = `${clientX}px`;
      menu.style.top = `${clientY}px`;
    }
  }

  useEffect(() => {
    const menu = contextRef.current;
    function removeContext(e) {
      if (!menu.contains(e.target)) {
        menu.style.display = 'none';
      }
    }
    document.addEventListener('click', removeContext);
    return () => document.removeEventListener('click', removeContext);
  }, []);

  return (
    <div className="">
      <div className="flex h-[60px] items-center justify-between">
        <h1 className="text-3xl font-medium">Notes</h1>
        <div className="flex items-center justify-end gap-2">
          <button onClick={handleAddNote} className="h-[30px] cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]">
            New Note
          </button>
          <button onClick={() => setNoteModalOpen(true)} className="h-[30px] cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]">
            Quick Note
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh_-_120px)] overflow-y-auto rounded-lg border border-zinc-200 p-2">
        {noteIsLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <LoaderSvg className="animate-spin" width="30" height="30" />
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
            {notes.map((note) => (
              <EachNote key={note.id} note={note} func={{ setContextMenu, setOnContextSelectedNoteId }} />
            ))}
          </div>
        )}
      </div>

      <div ref={contextRef} onContextMenu={(e) => e.preventDefault()} className="fixed top-0 left-0 z-10 hidden rounded-lg bg-white p-1 shadow-md">
        <div className="grid overflow-hidden rounded-md">
          <button onClick={() => console.log(onContextSelectedNoteId)} className="flex cursor-pointer bg-zinc-50 px-3 py-2 text-sm transition-colors hover:border-zinc-200 hover:bg-zinc-200">
            Edit
          </button>
          <button onClick={() => setNotes((prev) => prev.filter((note) => note.id !== onContextSelectedNoteId))} className="flex cursor-pointer bg-zinc-50 px-3 py-2 text-sm transition-colors hover:border-zinc-200 hover:bg-zinc-200">
            Move to trash
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notes;
