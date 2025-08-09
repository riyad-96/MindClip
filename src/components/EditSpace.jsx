import { format, formatDistanceToNow, isSameYear, isThisYear } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeftSvg, CloudDoneSvg, LoaderSvg, NoteAddedSvg, NoteUpdatedSvg } from './Svgs';
import { doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUser, useNotes } from '../contexts/contexts';
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditSpace() {
  const { user } = useUser();
  const { noteId } = useParams();
  const { notes, setNotes } = useNotes();
  const navigate = useNavigate();

  const [currentEditingNote, setCurrentEditingNote] = useState(() => notes.find((note) => note.id === noteId));
  const { id, title, text, createdAt, updatedAt } = currentEditingNote;

  const times = {
    created: createdAt?.toDate?.() || new Date(),
    updated: updatedAt?.toDate?.() || new Date(),
  };

  const createdDate = `${format(times.created, 'h:mm a')}, ${isSameYear(times.created, new Date()) ? format(times.created, 'dd MMM') : format(times.created, 'dd MMM yy')}`;

  const [isCurrentEditingNoteUpdating, setIsCurrentEditingNoteUpdating] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const updateInterval = setInterval(async () => {
      setTick((prev) => prev + 1);
      console.log(tick);
    }, 3000);

    return () => clearInterval(updateInterval);
  }, [tick]);

  //! Updation features
  const [localTitle, setLocalTitle] = useState('');
  const [localText, setLocalText] = useState('');

  useEffect(() => {
    if (currentEditingNote) {
      setLocalTitle(title || '');
      setLocalText(text || '');
    }
  }, []);

  function handleTitleChange(e) {
    const value = e.target.value;
    setLocalTitle(value);
    debounceNoteUpdate('title', value.trim());
  }

  function handleTextChange(e) {
    const value = e.target.value;
    setLocalText(value);
    debounceNoteUpdate('text', value);
  }

  //! debounce timer
  const debounceTimer = useRef(null);

  function debounceNoteUpdate(field, value) {
    setIsCurrentEditingNoteUpdating(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      const docRef = doc(db, 'users', user.uid, 'notes', noteId);

      try {
        await updateDoc(docRef, {
          [field]: value,
          updatedAt: serverTimestamp(),
        });
        const newtime = Timestamp.now();
        setCurrentEditingNote((prev) => ({ ...prev, updatedAt: new Date(), [field]: value }));
        setNotes((prev) => prev.map((note) => (note.id === noteId ? { ...note, [field]: value, updatedAt: newtime } : note)));
      } catch (err) {
        console.error(err);
      }

      setIsCurrentEditingNoteUpdating(false);
    }, 400);
  }

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{
        x: '100%',
      }}
      animate={{
        x: 0,
        transition: { duration: 0.3 },
      }}
      className="absolute inset-0 top-0 left-0 z-5 grid h-full grid-rows-[auto_1fr] bg-zinc-50 transition-colors duration-150 dark:bg-zinc-900"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (isCurrentEditingNoteUpdating) return;
            setIsCurrentEditingNoteUpdating(false);
            window.history.back();
          }}
          className="relative grid size-[25px] cursor-pointer place-items-center rounded-sm bg-zinc-200 transition-colors duration-150 active:translate-y-[1px] dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          <ArrowLeftSvg width="22" height="22" />
          <span className="absolute -inset-2 [@media(pointer:fine)]:hidden"></span>
        </button>

        <div className="flex h-[60px] flex-1 items-center justify-between">
          <div className="grid">
            <span className="flex cursor-default items-center gap-1 text-xs">
              <NoteAddedSvg width="14" height="14" />
              <span>Created: {createdDate}</span>
            </span>
            <span title={`Updated at ${format(times.updated, 'h:mm a')}, ${isThisYear(times.updated, new Date()) ? format(times.updated, 'dd MMM') : format(times.updated, 'dd MMM yy')}`} className="flex cursor-default items-center gap-1 text-xs">
              {isCurrentEditingNoteUpdating ? <LoaderSvg className="animate-spin" width="14" height="14" /> : <NoteUpdatedSvg width="14" height="14" />}
              <span>Updated: {formatDistanceToNow(times.updated, { addSuffix: true })}</span>
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
                  className="grid animate-spin place-items-center opacity-70"
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
                  className="grid place-items-center opacity-70"
                >
                  <CloudDoneSvg width="30" height="30" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="grid grid-rows-[auto_1fr] rounded-lg border-1 border-zinc-300 transition-colors dark:border-zinc-800 dark:focus-within:border-zinc-600">
        <input placeholder="Title" type="text" value={localTitle} onChange={handleTitleChange} className="w-full px-3 pt-2 text-lg font-medium outline-none" />
        <textarea placeholder="Take a note" value={localText} onChange={handleTextChange} className="w-full resize-none px-3 pt-1 pb-8 outline-none"></textarea>
      </div>
    </motion.div>
  );
}

export default EditSpace;
