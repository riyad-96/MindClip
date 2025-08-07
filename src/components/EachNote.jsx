import { motion } from 'motion/react';
import { format, isSameYear } from 'date-fns';

function EachNote({ note, func }) {
  const { id, title, text, createdAt, updatedAt } = note;
  const { openContextMenu, assignCurrentEditingNote } = func;
  const times = {
    creation: createdAt?.toDate?.() || new Date(),
    updated: updatedAt?.toDate?.() || new Date(),
  };

  const createdDate = isSameYear(times.creation, new Date()) ? format(times.creation, 'dd MMM') : format(times.creation, 'dd MMM yy');
  const createdTime = format(times.creation, 'h:mm a');
  const updatedDate = times.updated;

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { duration: 0.3 },
      }}
      exit={{
        opacity: 0,
      }}
      className="group relative grid max-w-[810px] grid-rows-[23px_1fr] gap-2 overflow-hidden rounded-lg border border-zinc-200 p-4 text-zinc-700 transition-[box-shadow,color,background-color] select-none hover:text-zinc-950 hover:shadow-md hover:shadow-zinc-200 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:shadow-zinc-800"
    >
      <span className="line-clamp-1 text-lg leading-tight font-medium">{title}</span>
      <div className="line-clamp-5 min-h-[50px] leading-snug whitespace-pre-wrap">{text}</div>

      <span
        onClick={() => assignCurrentEditingNote({ id, title, text, createdDate: `${createdTime}, ${createdDate}`, updatedDate })}
        onContextMenu={(e) => {
          e.preventDefault();
          const minRight = window.innerWidth - e.clientX;
          openContextMenu({ clientX: minRight < 145 ? e.clientX - 128 : e.clientX, clientY: e.clientY, id });
        }}
        className="absolute inset-0 z-1 cursor-pointer active:bg-white/30 dark:active:bg-white/1"
      ></span>
    </motion.div>
  );
}

export default EachNote;
