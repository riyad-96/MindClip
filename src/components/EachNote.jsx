import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontalSvg } from './Svgs';
import { useEffect, useRef } from 'react';

function EachNote({ note, func }) {
  const { id, title, text, createdAt } = note;
  const { setContextMenu, setOnContextSelectedNoteId } = func;
  const readableDate = createdAt?.toDate?.() || new Date();
  const relativeTime = formatDistanceToNow(readableDate, { addSuffix: true });

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { duration: 1 },
      }}
      className="group relative rounded-lg border border-zinc-200 p-3 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
    >
      <span className="text-xl font-medium">{title}</span>
      <div className="line-clamp-4 min-h-[40px] whitespace-pre-wrap">{text}</div>

      <span
        onContextMenu={(e) => {
          e.preventDefault();
          setOnContextSelectedNoteId(id);
          setContextMenu({ clientX: e.clientX, clientY: e.clientY, id: id, e });
        }}
        className="absolute inset-0 z-1 cursor-pointer"
      ></span>
    </motion.div>
  );
}

export default EachNote;
