import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/contexts';
import { CheckBoxSvg } from './Svgs';

function EachNote({ state, func }) {
  const { note, selectedNotes } = state;
  const { selectNotes } = func;
  const { id, title, text } = note;
  const { isTouchDevice } = useUser();
  const isSelected = selectedNotes.includes(id);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { duration: 0.5 },
      }}
      className={`group duration-150ms relative grid grid-rows-[auto_1fr] gap-2 rounded-lg border border-zinc-200 p-4 transition-colors select-none hover:text-zinc-950 dark:border-zinc-800 dark:hover:text-zinc-50 ${isSelected ? 'text-zinc-950 outline-2 outline-zinc-500 dark:text-zinc-50 dark:outline-zinc-400' : 'text-zinc-700 outline-2 outline-transparent dark:text-zinc-300 [@media(pointer:fine)]:hover:outline-zinc-300 dark:[@media(pointer:fine)]:hover:outline-zinc-700'}`}
    >
      <span className="line-clamp-1 text-lg leading-tight font-medium">{title}</span>
      <div className="line-clamp-5 min-h-[50px] leading-snug break-words whitespace-pre-wrap">{text}</div>

      <span
        onClick={() => {
          if (selectedNotes.length === 0) {
            navigate(`/${id}`);
          } else {
            selectNotes(id);
          }
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

      <button onClick={() => selectNotes(id)} className={`absolute top-0 left-0 z-2 grid size-[20px] -translate-1/2 cursor-pointer place-items-center transition-opacity duration-150 [@media(pointer:fine)]:group-hover:opacity-100 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
        <CheckBoxSvg className="relative z-2" width="20" height="20" />
        <span className="absolute inset-1 z-1 rounded-full bg-white transition-colors duration-150 dark:bg-black"></span>
      </button>
    </motion.div>
  );
}

export default EachNote;
