import { motion } from 'motion/react';
import { useState } from 'react';
import { CheckBoxSvg } from './Svgs';
import { useUser } from '../contexts/UserContextProvider';

function EachTrashNote({ note, func }) {
  const { notes, selectedNotes } = note;
  const { id, text, title } = notes;
  const { selectNotes, showPreview } = func;

  const isSelected = selectedNotes.includes(id);
  const { isTouchDevice } = useUser();

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { duration: 0.5 },
      }}
      className={`group relative grid max-w-[810px] grid-rows-[auto_1fr] gap-2 rounded-lg border border-zinc-200 p-4 transition-colors duration-[150ms,200ms] select-none hover:text-zinc-950 hover:shadow-md dark:border-zinc-800 dark:hover:text-zinc-50 ${isSelected ? 'text-zinc-950 outline-2 outline-zinc-500 dark:text-zinc-50 dark:outline-zinc-400' : 'text-zinc-700 outline-2 outline-transparent dark:text-zinc-300'}`}
    >
      <span className="line-clamp-1 text-lg leading-tight font-medium">{title}</span>
      <div className="line-clamp-4 min-h-[50px] leading-snug break-words whitespace-pre-wrap">{text}</div>

      <span
        onClick={() => {
          if (selectedNotes.length === 0) {
            showPreview(id);
            return;
          }
          selectNotes(id);
        }}
        onContextMenu={(e) => {
          if (isTouchDevice) {
            selectNotes(id);
            e.preventDefault();
          } else {
            e.preventDefault();
          }
        }}
        className={`absolute inset-0 z-1 cursor-pointer ${isSelected ? 'bg-black/5 [@media(pointer:fine)]:active:bg-black/10' : '[@media(pointer:fine)]:active:bg-white/30 dark:[@media(pointer:fine)]:active:bg-white/5'}`}
      ></span>
      <button onClick={() => selectNotes(id)} className={`absolute top-0 left-0 z-2 grid size-[20px] -translate-1/3 cursor-pointer place-items-center transition-opacity duration-150 group-hover:opacity-100 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
        <CheckBoxSvg className="relative z-2" width="20" height="20" />
        <span className="absolute inset-1 z-1 rounded-full bg-white dark:bg-black"></span>
      </button>
    </motion.div>
  );
}

export default EachTrashNote;
