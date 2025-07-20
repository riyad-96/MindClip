import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

function EachNote({ note, func }) {
  const { id, title, text, createdAt } = note;
  const { openContextMenu } = func;
  const readableDate = createdAt?.toDate?.() || new Date();
  const relativeTime = formatDistanceToNow(readableDate, { addSuffix: true });

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
      className="group relative grid max-w-[810px] grid-rows-[23px_1fr] gap-2 rounded-lg border border-zinc-200 p-4 text-zinc-700 transition-[box-shadow,color,background-color] select-none hover:text-zinc-950 hover:shadow-md"
    >
      <span className="line-clamp-1 text-lg leading-tight font-medium">{title}</span>
      <div className="line-clamp-5 min-h-[50px] leading-snug whitespace-pre-wrap">{text}</div>

      <span
        onContextMenu={(e) => {
          e.preventDefault();
          const minRight = window.innerWidth - e.clientX;
          openContextMenu({ clientX: minRight < 145 ? e.clientX - 128 : e.clientX, clientY: e.clientY, id });
        }}
        className="absolute inset-0 z-1 cursor-pointer active:bg-white/30"
      ></span>
    </motion.div>
  );
}

export default EachNote;
