import { format, formatDistanceToNow, isThisYear } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftSvg, CloudDoneSvg, LoaderSvg, NoteAddedSvg, NoteUpdatedSvg } from './Svgs';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUser } from '../contexts/UserContextProvider';
import { useEffect, useRef, useState } from 'react';

function EditSpace({ func, state }) {
  const { user } = useUser();

  const { currentEditingNote, isCurrentNoteEditing } = state;
  const { setCurrentEditingNote, setIsCurrentNoteEditing, fetchUserNotes } = func;

  const [isCurrentEditingNoteUpdating, setIsCurrentEditingNoteUpdating] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const updateInterval = setInterval(async () => {
      setTick((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(updateInterval);
  }, [isCurrentNoteEditing, tick]);

  async function updateNote() {
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
      setTick((prev) => prev + 1);
      setIsCurrentEditingNoteUpdating(false);
    } catch (error) {
      console.error(error);
    }
  }

  const debounceTimer = useRef(null);

  function debounceNoteUpdate(field, value) {
    setCurrentEditingNote((prev) => ({ ...prev, [field]: value }));
    setIsCurrentEditingNoteUpdating(true);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(updateNote, 500);
  }

  return (
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

          <div className="grid">
            <AnimatePresence>
              {isCurrentEditingNoteUpdating ? (
                <motion.span
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 0.7,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="grid animate-spin cursor-pointer place-items-center opacity-70"
                >
                  <LoaderSvg width="30" height="30" />
                </motion.span>
              ) : (
                <motion.button
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 0.7,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="grid cursor-pointer place-items-center opacity-70"
                  onClick={() => {
                    setIsCurrentEditingNoteUpdating(true);
                    updateNote();
                  }}
                >
                  <CloudDoneSvg width="30" height="30" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-rows-[auto_1fr] rounded-lg border-1 border-zinc-300">
        <input type="text" value={currentEditingNote.title} onChange={(e) => debounceNoteUpdate('title', e.target.value)} className="px-3 pt-2 text-lg font-medium outline-none" />
        <textarea value={currentEditingNote.text} onChange={(e) => debounceNoteUpdate('text', e.target.value)} className="resize-none px-3 pt-1 pb-8 outline-none"></textarea>
      </div>
    </motion.div>
  );
}

export default EditSpace;
