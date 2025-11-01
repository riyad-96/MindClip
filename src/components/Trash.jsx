import { useCallback, useEffect, useState } from 'react';
import { useNotes, useUser } from '../contexts/contexts';
import { CloseSvg, DeleteForeverSvg, LoaderSvg, RestoreFromTrashSvg, TrashSvg } from './Svgs';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import EachTrashNote from './EachTrashNote';
import { motion, AnimatePresence } from 'motion/react';
import DeleteModal from './DeleteModal';
import PreviewModal from './PreviewModal';

function Trash() {
  const { user, setIsActivityDisabled } = useUser();
  const { trashes, setTrashes } = useNotes();

  const [isTrashLoading, setIsTrashLoading] = useState(true);

  //! Fetch trashed notes
  const fetchUserTrashedNotes = useCallback(async () => {
    const trashedNoteCollectionRef = collection(db, 'users', user.uid, 'trash');

    try {
      const notesQuery = query(trashedNoteCollectionRef, orderBy('trashedAt', 'desc'));
      const trashedNotes = await getDocs(notesQuery);
      const trashArray = [];
      trashedNotes.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        trashArray.push(obj);
      });

      setTrashes(trashArray);
      setIsTrashLoading(false);
    } catch (error) {
      console.error(error);
      setIsTrashLoading(false);
    }
  }, [user.uid, setTrashes]);

  useEffect(() => {
    fetchUserTrashedNotes();
  }, [fetchUserTrashedNotes]);

  //! Selected Notes
  const [selectedNotes, setSeletedNotes] = useState([]);
  function selectNotes(id) {
    setSeletedNotes((prev) => (prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]));
  }

  //! delete notes
  const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false);
  async function deleteNotes() {
    setIsActivityDisabled(true);
    const deletePromises = selectedNotes.map((noteId) => deleteDoc(doc(db, 'users', user.uid, 'trash', noteId)));

    try {
      await Promise.all(deletePromises);
      selectedNotes.forEach((noteId) => {
        setTrashes((prev) => prev.filter((note) => note.id !== noteId));
      });
      setIsDeleteModalShowing(false);
      setSeletedNotes([]);
      setIsActivityDisabled(false);
    } catch (error) {
      setIsActivityDisabled(false);
      console.error(error);
    }
  }

  //! restore notes
  async function restoreNotes() {
    setIsActivityDisabled(true);
    const addingNotesArray = selectedNotes.map((noteId) => {
      return trashes.find((trashNote) => trashNote.id === noteId);
    });
    const addDocToNotes = addingNotesArray.map((note) => setDoc(doc(db, 'users', user.uid, 'notes', note.id), { text: note.text, title: note.title, createdAt: note.createdAt, updatedAt: note.updatedAt }));
    const deleteDocFromTrash = addingNotesArray.map((note) => deleteDoc(doc(db, 'users', user.uid, 'trash', note.id)));

    try {
      await Promise.all([...addDocToNotes, ...deleteDocFromTrash]);
      selectedNotes.forEach((noteId) => {
        setTrashes((prev) => prev.filter((note) => note.id !== noteId));
      });
      setIsActivityDisabled(false);
    } catch (error) {
      console.error(error);
      setIsActivityDisabled(false);
    }
  }

  //! preview feature
  const [previewNote, setPreviewNote] = useState('');
  const [isPreviewModalShowing, setIsPreviewModalShowing] = useState(false);
  function showPreview(id) {
    setIsPreviewModalShowing(true);
    const selectedPreviewNote = trashes.find((note) => note.id === id);
    setPreviewNote({
      id,
      text: selectedPreviewNote.text,
      title: selectedPreviewNote.title,
      trashedAt: selectedPreviewNote.trashedAt,
    });
  }

  return (
    <div>
      <div className="flex h-[60px] items-center justify-between">
        <h1 className="text-[length:clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)] font-medium">Trash</h1>
        <AnimatePresence>
          {selectedNotes.length !== 0 && (
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
                duration: 0.1,
              }}
              className="flex items-center gap-4 transition-opacity duration-150"
            >
              <span>{selectedNotes.length} seleted</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setSeletedNotes([])} className="grid size-[30px] cursor-pointer place-items-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-800 active:translate-y-[1px] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 [@media(pointer:coarse)]:text-zinc-800 dark:[@media(pointer:coarse)]:text-zinc-50">
                  <CloseSvg width="20" height="20" />
                </button>
                <button onClick={restoreNotes} className="grid size-[30px] cursor-pointer place-items-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-800 active:translate-y-[1px] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 [@media(pointer:coarse)]:text-zinc-800 dark:[@media(pointer:coarse)]:text-zinc-50">
                  <RestoreFromTrashSvg width="24" height="24" />
                </button>
                <button onClick={() => setIsDeleteModalShowing(true)} className="grid size-[30px] cursor-pointer place-items-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-800 active:translate-y-[1px] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 [@media(pointer:coarse)]:text-zinc-800 dark:[@media(pointer:coarse)]:text-zinc-50">
                  <DeleteForeverSvg width="24" height="24" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="note-trash-h duration- overflow-y-auto rounded-lg border border-zinc-200 p-3 transition-colors dark:border-zinc-800">
        {isTrashLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <LoaderSvg className="animate-spin" width="30" height="30" />
          </div>
        ) : trashes.length === 0 ? (
          <div className="grid h-[200px] content-center justify-items-center gap-2 md:h-[300px]">
            <span className="opacity-80">No notes in trash</span>
            <TrashSvg width="100" height="100" className="opacity-30" />
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3">
            <AnimatePresence>
              {trashes.map((notes) => (
                <EachTrashNote key={notes.id} note={{ notes, selectedNotes }} func={{ selectNotes, showPreview }} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>{isPreviewModalShowing && <PreviewModal note={previewNote} func={{ setPreviewNote, setIsPreviewModalShowing }} />}</AnimatePresence>
      <AnimatePresence>{isDeleteModalShowing && <DeleteModal func={{ setIsDeleteModalShowing, deleteNotes }} texts={`${selectedNotes.length} selected note${selectedNotes.length < 2 ? '' : 's'} will be deleted permanently.`} />}</AnimatePresence>
    </div>
  );
}

export default Trash;
