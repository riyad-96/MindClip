import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotes, useUser } from '../contexts/contexts';

import { db } from '../config/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { LoaderSvg } from './Svgs';
import EachNote from './EachNote';
import { AnimatePresence, motion } from 'motion/react';

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

  //! Modal and custom context menu
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    id: '',
  });

  const [currentNote, setCurrentNote] = useState('');
  function getCurrentNoteTitle() {
    const note = notes.find((savedNote) => savedNote.id === currentNote);
    return note.title;
  }

  function openContextMenu({ clientX, clientY, id }) {
    console.log(clientX, clientY, id);
    setContextMenu({ visible: false });
    setTimeout(() => {
      setContextMenu({
        visible: true,
        x: clientX,
        y: clientY,
        id,
      });
    }, 50);
    setCurrentNote(id);
  }

  useEffect(() => {
    function handleOutsideClick() {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    }

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [contextMenu.visible]);

  //! add notes
  const quickNoteTitleRef = useRef(null);
  const quickNoteBodyRef = useRef(null);

  useEffect(() => {
    if (noteModalOpen && quickNoteTitleRef.current) {
      quickNoteTitleRef.current.focus();
    }
  }, [noteModalOpen]);

  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteBody, setQuickNoteBody] = useState('');

  async function handleAddNoteModal() {
    setIsInteractivityDisabled(true);
    const notesCollectionRef = collection(db, 'users', user.uid, 'notes');

    const databaseNote = {
      title: quickNoteTitle.trim(),
      text: quickNoteBody,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const addedNote = await addDoc(notesCollectionRef, databaseNote);
      const newNoteId = addedNote.id;

      const localNote = {
        id: newNoteId,
        title: quickNoteTitle.trim(),
        text: quickNoteBody,
      };
      setNotes((prev) => [localNote, ...prev]);
      setQuickNoteTitle('');
      setQuickNoteBody('');
      setNoteModalOpen(false);
      setIsInteractivityDisabled(false);
    } catch (error) {
      console.error(error);
      setIsInteractivityDisabled(false);
    }
  }

  //! Add to trash
  const [isInteractivityDisabled, setIsInteractivityDisabled] = useState(false);

  async function handleTrash() {
    setIsInteractivityDisabled(true);
    const noteDocRef = doc(db, 'users', user.uid, 'notes', contextMenu.id);
    const trashDocRef = doc(db, 'users', user.uid, 'trash', contextMenu.id);

    try {
      setContextMenu((prev) => ({ ...prev, visible: false, id: '' }));
      const selectedNote = await getDoc(noteDocRef);
      const localObj = {
        ...selectedNote.data(),
        trashedAt: serverTimestamp(),
      };

      await setDoc(trashDocRef, localObj);
      await deleteDoc(noteDocRef);
      fetchUserNotes();
      setIsInteractivityDisabled(false);
    } catch (error) {
      console.error(error);
      setIsInteractivityDisabled(false);
    }
  }

  //! Note delete program
  const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false);

  async function deleteNote() {
    setIsInteractivityDisabled(true);
    const noteRef = doc(db, 'users', user.uid, 'notes', currentNote);
    try {
      await deleteDoc(noteRef);
      fetchUserNotes();
      setIsDeleteModalShowing(false);
      setIsInteractivityDisabled(false);
    } catch (error) {
      console.error(error);
      setIsInteractivityDisabled(false);
    }
  }

  return (
    <div className="relative">
      {isInteractivityDisabled && <span onContextMenu={(e) => e.preventDefault()} className="fixed inset-0 z-100 cursor-not-allowed"></span>}
      <div className="flex h-[60px] items-center justify-between">
        <h1 className="text-[length:clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)] font-medium">Notes</h1>
        <div className="flex items-center justify-end gap-2">
          <button className="h-[30px] cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]">New Note</button>
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
        ) : notes.length === 0 ? (
          <div className="grid h-[200px] content-center justify-items-center gap-2">
            <span className="opacity-80">There is no note right now.</span>
            <button onClick={() => setNoteModalOpen(true)} className="h-[30px] cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]">
              Add note !
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
            {notes.map((note) => (
              <EachNote key={note.id} note={note} func={{ openContextMenu }} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {contextMenu.visible && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.05,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
            onContextMenu={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="fixed top-0 left-0 z-10 rounded-lg bg-white p-1 shadow-md"
          >
            <div className="grid overflow-hidden rounded-md whitespace-nowrap">
              <button onClick={() => console.log(contextMenu.id)} className="flex cursor-pointer bg-zinc-50 px-3 py-2 text-sm transition-colors hover:bg-zinc-200">
                Edit Note
              </button>
              <button onClick={handleTrash} className="flex cursor-pointer bg-zinc-50 px-3 py-2 text-sm transition-colors hover:bg-zinc-200">
                Move to trash
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalShowing(true);
                  setContextMenu({ visible: false });
                }}
                className="flex cursor-pointer bg-zinc-50 px-3 py-2 text-sm transition-colors hover:bg-zinc-200"
              >
                Delete note
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {noteModalOpen && (
          <motion.div
            onMouseDown={() => setNoteModalOpen(false)}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: { duration: 0.2 },
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4"
          >
            <div onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-[600px] space-y-4 rounded-xl bg-zinc-100 p-5 shadow-xl">
              <div className="grid rounded-lg border border-zinc-200 transition-colors focus-within:border-zinc-300">
                <input
                maxLength="100"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      quickNoteBodyRef.current.focus();
                    }
                  }}
                  ref={quickNoteTitleRef}
                  value={quickNoteTitle}
                  onChange={(e) => setQuickNoteTitle(e.target.value)}
                  type="text"
                  placeholder="Title"
                  className="px-4 py-2 text-lg font-medium outline-none"
                />
                <textarea
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      e.preventDefault();
                      handleAddNoteModal();
                    }
                  }}
                  ref={quickNoteBodyRef}
                  value={quickNoteBody}
                  onChange={(e) => setQuickNoteBody(e.target.value)}
                  placeholder="Take a note..."
                  className="max-h-[calc(100vh_-_300px)] min-h-[200px] px-4 py-2 outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setNoteModalOpen(false)} className="h-[30px] cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]">
                  Cancel
                </button>
                <button onClick={handleAddNoteModal} className="h-[30px] cursor-pointer rounded-md border-1 border-zinc-300 bg-zinc-200 px-3 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]">
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalShowing && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: { duration: 0.2 },
            }}
            exit={{
              opacity: 0,
            }}
            onMouseDown={() => setIsDeleteModalShowing(false)}
            className="fixed inset-0 z-10 flex items-center justify-center bg-black/30"
          >
            <div onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-[400px] rounded-2xl bg-white shadow-xl">
              <span className="block border-b-1 border-zinc-200 px-4 py-3 text-lg font-medium">Delete this note !</span>
              <div className="space-y-6 px-4 py-4">
                <span className="block leading-snug">
                  This action is irrevarsible. '<span className="font-medium break-words">{getCurrentNoteTitle() || 'Untitled'}</span>' will be deleted permanently.
                </span>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsDeleteModalShowing(false)} className="h-[35px] cursor-pointer rounded-full border border-zinc-300 bg-zinc-200 px-5 text-sm tracking-wide transition-colors hover:bg-zinc-300 active:translate-y-[1px]">
                    Cancel
                  </button>
                  <button onClick={deleteNote} className="h-[35px] cursor-pointer rounded-full border border-red-600 bg-red-500 px-5 text-sm tracking-wide text-white transition-colors hover:border-red-400 hover:bg-red-400 active:translate-y-[1px]">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Notes;
