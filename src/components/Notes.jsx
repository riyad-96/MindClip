import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotes, useUser } from '../contexts/contexts';

import { db } from '../config/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeftSvg, LoaderSvg, NoteAddedSvg, NoteUpdatedSvg } from './Svgs';
import EachNote from './EachNote';
import { AnimatePresence, motion } from 'motion/react';
import { format, formatDistanceToNow, isThisYear } from 'date-fns';
import DeleteModal from './DeleteModal';

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

      setNotes(notesArray);
      setNoteIsLoading(false);
      console.log('fetched');
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

  async function deleteNotes() {
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

  //! editing note in editing space
  const [isCurrentNoteEditing, setIsCurrentNoteEditing] = useState(false);
  const [currentEditingNote, setCurrentEditingNote] = useState(null);
  const [isCurrentEditingNoteUpdating, setIsCurrentEditingNoteUpdating] = useState(false);
  const [tick, setTick] = useState(0);

  function assignCurrentEditingNote({ id, title, text, createdDate, updatedDate }) {
    setCurrentEditingNote({ id, title, text, createdDate, updatedDate });
    setIsCurrentNoteEditing(true);
  }

  async function updateEditedNote() {
    setIsCurrentEditingNoteUpdating(true);
    const docRef = doc(db, 'users', user.uid, 'notes', currentEditingNote.id);

    try {
      await updateDoc(docRef, {
        title: currentEditingNote.title,
        text: currentEditingNote.text,
        updatedAt: serverTimestamp(),
      });
      const updatedFetchedNote = await getDoc(docRef);
      const noteObj = {
        ...updatedFetchedNote.data(),
      };
      setCurrentEditingNote((prev) => ({ ...prev, updatedDate: noteObj.updatedAt.toDate() }));
      setIsCurrentEditingNoteUpdating(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!isCurrentNoteEditing) return;
    const updateInterval = setInterval(async () => {
      setTick((prev) => prev + 1);
      console.log(tick);
    }, 3000);
    return () => clearInterval(updateInterval);
  }, [isCurrentNoteEditing, tick]);

  return (
    <div className="relative overflow-hidden">
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
            {notes.map((note) => (
              <EachNote key={note.id} note={note} func={{ openContextMenu, assignCurrentEditingNote }} />
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

      <AnimatePresence>{isDeleteModalShowing && <DeleteModal texts={<span><span className="font-medium">'{getCurrentNoteTitle()}'</span> will be deleted permanently.</span>} func={{ deleteNotes, setIsDeleteModalShowing }} />}</AnimatePresence>

      <AnimatePresence>
        {isCurrentNoteEditing && (
          <motion.div
            initial={{
              translateX: '100%',
            }}
            animate={{
              translateX: 0,
              transition: { duration: 0.3 },
            }}
            exit={{
              translateX: '100%',
              transition: { duration: 0.3 },
            }}
            className="absolute inset-0 top-0 left-0 z-5 grid grid-rows-[auto_1fr] rounded-lg bg-zinc-50"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setCurrentEditingNote(null);
                  setIsCurrentNoteEditing(false);
                  setIsCurrentEditingNoteUpdating(false);
                  fetchUserNotes();
                }}
                className="relative grid size-[25px] cursor-pointer place-items-center rounded-sm bg-zinc-200 active:translate-y-[1px]"
              >
                <ArrowLeftSvg width="22" height="22" />
                <span className="absolute -inset-2 [@media(pointer:fine)]:hidden"></span>
              </button>

              <div className="flex h-[60px] flex-1 items-center justify-between">
                <div className="grid">
                  <span title="Created at" className="flex cursor-default items-center gap-1 text-xs">
                    <NoteAddedSvg width="14" height="14" />
                    <span>{currentEditingNote.createdDate}</span>
                  </span>
                  <span title={`Updated at ${format(currentEditingNote.updatedDate, 'h:mm a')}, ${isThisYear(currentEditingNote.updatedDate, new Date()) ? format(currentEditingNote.updatedDate, 'dd MMM') : format(currentEditingNote.updatedDate, 'dd MMM yy')}`} className="flex cursor-default items-center gap-1 text-xs">
                    {isCurrentEditingNoteUpdating ? <LoaderSvg className="animate-spin" width="14" height="14" /> : <NoteUpdatedSvg width="14" height="14" />}
                    <span>{formatDistanceToNow(currentEditingNote.updatedDate, { addSuffix: true })}</span>
                  </span>
                </div>

                <div className="flex gap-4">
                  <button onClick={updateEditedNote} className="cursor-pointer active:opacity-50">
                    update
                  </button>
                  <button className="cursor-pointer active:opacity-50">refresh</button>
                </div>
              </div>
            </div>

            <div className="grid grid-rows-[auto_1fr] rounded-lg border-1 border-zinc-300">
              <input type="text" value={currentEditingNote.title} onChange={(e) => setCurrentEditingNote((prev) => ({ ...prev, title: e.target.value }))} className="px-3 pt-2 text-lg font-medium outline-none" />
              <textarea value={currentEditingNote.text} onChange={(e) => setCurrentEditingNote((prev) => ({ ...prev, text: e.target.value }))} className="resize-none px-3 pt-1 pb-8 outline-none"></textarea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Notes;
