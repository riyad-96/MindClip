import { useEffect, useRef, useState } from 'react';
import { useNotes, useUser } from '../contexts/contexts';
import { db } from '../config/firebase';
import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { LoaderSvg, AddNoteSvg, CloseSvg, DeleteForeverSvg, TrashSvg } from './Svgs';
import EachNote from './EachNote';
import { AnimatePresence, motion } from 'motion/react';
import DeleteModal from './DeleteModal';
import { Outlet } from 'react-router-dom';

function Notes() {
  const { user, setIsActivityDisabled } = useUser();
  const { notes, setNotes, setNotesLoading, addNoteToDatabase } = useNotes();
  const [noteIsLoading, setNoteIsLoading] = useState(true);

  //! FetchNotes
  useEffect(() => {
    (async () => {
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
      } catch (error) {
        setNoteIsLoading(false);
        console.error(error);
      } finally {
        setNotesLoading(false);
      }
    })();
  }, []);

  //! Modal and custom context menu
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  //! add notes
  const [isInteractivityDisabled, setIsInteractivityDisabled] = useState(false);

  const quickNoteTitleRef = useRef(null);
  const quickNoteBodyRef = useRef(null);

  useEffect(() => {
    if (noteModalOpen && quickNoteTitleRef.current) {
      quickNoteTitleRef.current.focus();
    }
  }, [noteModalOpen]);

  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteBody, setQuickNoteBody] = useState('');

  function handleAddNoteModal() {
    const notesCollectionRef = collection(db, 'users', user.uid, 'notes');

    const databaseNote = {
      title: quickNoteTitle.trim(),
      text: quickNoteBody,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    addNoteToDatabase({ notesCollectionRef, databaseNote });
    setQuickNoteTitle('');
    setQuickNoteBody('');
    setNoteModalOpen(false);
  }

  //! Note selection
  const [selectedNotes, setSelectedNotes] = useState([]);

  function selectNotes(id) {
    setSelectedNotes((prev) => (prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]));
  }

  //! Note delete program
  const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false);

  async function deleteNotes() {
    setIsActivityDisabled(true);
    const deletePromises = selectedNotes.map((noteId) => deleteDoc(doc(db, 'users', user.uid, 'notes', noteId)));

    try {
      await Promise.all(deletePromises);
      selectedNotes.forEach((noteId) => {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
      });
      setIsDeleteModalShowing(false);
      setSelectedNotes([]);
      setIsActivityDisabled(false);
    } catch (error) {
      setIsActivityDisabled(false);
      console.error(error);
    }
  }

  //! Note Trash program
  async function handleTrash() {
    setIsActivityDisabled(true);

    const trashingPromises = selectedNotes.map((noteId) => {
      const docRef = doc(db, 'users', user.uid, 'trash', noteId);
      const trashingNote = notes.find((note) => note.id === noteId);
      const { createdAt, updatedAt, title, text } = trashingNote;

      return setDoc(docRef, {
        createdAt,
        updatedAt,
        title,
        text,
        trashedAt: serverTimestamp(),
      });
    });

    const deletePromises = selectedNotes.map((noteId) => {
      const docRef = doc(db, 'users', user.uid, 'notes', noteId);
      return deleteDoc(docRef);
    });

    try {
      await Promise.all([...trashingPromises, ...deletePromises]);

      selectedNotes.forEach((noteId) => {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
      });
      setSelectedNotes([]);
      setIsActivityDisabled(false);
    } catch (error) {
      setIsActivityDisabled(false);
      console.error(error);
    }
  }

  return (
    <div className="relative overflow-hidden">
      {isInteractivityDisabled && <span onContextMenu={(e) => e.preventDefault()} className="fixed inset-0 z-100 cursor-not-allowed"></span>}
      <div className="flex h-[60px] items-center justify-between">
        <h1 className="text-[length:clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)] font-medium">Notes</h1>
        <div className="relative flex items-center justify-end">
          <AnimatePresence>
            {selectedNotes.length > 0 && (
              <motion.div
                initial={{
                  y: '-10px',
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: '-10px',
                  opacity: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="flex items-center gap-4"
              >
                <span>{selectedNotes.length} seleted</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedNotes([])} className="grid size-[30px] cursor-pointer place-items-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-800 active:translate-y-[1px] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 [@media(pointer:coarse)]:text-zinc-800 dark:[@media(pointer:coarse)]:text-zinc-50">
                    <CloseSvg width="20" height="20" />
                  </button>
                  <button onClick={handleTrash} className="grid size-[30px] cursor-pointer place-items-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-800 active:translate-y-[1px] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 [@media(pointer:coarse)]:text-zinc-800 dark:[@media(pointer:coarse)]:text-zinc-50">
                    <TrashSvg width="26" height="26" />
                  </button>
                  <button onClick={() => setIsDeleteModalShowing(true)} className="grid size-[30px] cursor-pointer place-items-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-800 active:translate-y-[1px] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 [@media(pointer:coarse)]:text-zinc-800 dark:[@media(pointer:coarse)]:text-zinc-50">
                    <DeleteForeverSvg width="24" height="24" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {selectedNotes.length === 0 && (
              <motion.button
                initial={{
                  y: '10px',
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: '10px',
                  opacity: 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                onClick={() => setNoteModalOpen(true)}
                className="uni-btn absolute grid size-[30px] items-center justify-center"
              >
                <AddNoteSvg width="20" height="20" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="note-trash-h overflow-y-auto rounded-lg border border-zinc-200 p-3 transition-[border-color] duration-150 dark:border-zinc-800">
        {noteIsLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <LoaderSvg className="animate-spin" width="30" height="30" />
          </div>
        ) : notes.length === 0 ? (
          <div className="grid h-[200px] content-center justify-items-center gap-2">
            <span className="opacity-80">There is no note right now.</span>
            <button onClick={() => setNoteModalOpen(true)} className="uni-btn h-[30px] text-sm">
              Add note !
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
            <AnimatePresence>
              {notes.map((note) => (
                <EachNote key={note.id} state={{ note, selectedNotes }} func={{ selectNotes }} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {noteModalOpen && (
          <motion.div
            onMouseDown={() => setNoteModalOpen(false)}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4 dark:bg-white/10 [@media(pointer:fine)]:backdrop-blur-[1px]"
          >
            <motion.div
              initial={{
                y: 100,
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                y: 0,
                scale: 1,
                opacity: 1,
              }}
              exit={{
                y: 100,
                scale: 0.9,
                opacity: 0,
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full max-w-[600px] space-y-4 rounded-xl bg-zinc-100 p-5 shadow-xl dark:bg-zinc-900"
            >
              <div className="grid rounded-lg border border-zinc-200 transition-colors focus-within:border-zinc-300 dark:border-zinc-800 dark:focus-within:border-zinc-600">
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
                  className="w-full px-4 py-2 text-lg font-medium outline-none"
                />
                <textarea
                  spellCheck="false"
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
                  className="max-h-[calc(100vh_-_300px)] min-h-[200px] w-full px-4 py-2 outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setNoteModalOpen(false)} className="uni-btn h-[30px]">
                  Cancel
                </button>
                <button onClick={handleAddNoteModal} className="uni-btn h-[30px]">
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{isDeleteModalShowing && <DeleteModal func={{ deleteNotes, setIsDeleteModalShowing }} texts={`${selectedNotes.length} selected note${selectedNotes.length < 2 ? '' : 's'} will be deleted permanently.`} />}</AnimatePresence>

      <Outlet />
    </div>
  );
}

export default Notes;
