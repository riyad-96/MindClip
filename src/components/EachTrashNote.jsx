import { motion } from 'motion/react';

function EachTrashNote({ note }) {
  console.log(note);
  const { title, text, id } = note;
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { duration: 0.5 },
      }}
      className="group relative grid grid-rows-[auto_1fr] gap-2 rounded-lg border border-zinc-200 p-4 text-zinc-700 transition-[box-shadow] hover:shadow-md select-none  hover:text-zinc-950"
    >
      <span className="line-clamp-1 text-lg leading-tight font-medium">{title}</span>
      <div className="line-clamp-4 min-h-[50px] leading-snug whitespace-pre-wrap">{text}</div>

      <span className="absolute inset-0 z-1 cursor-pointer active:bg-white/30"></span>
    </motion.div>
  );
}

export default EachTrashNote;
