import { format, isToday } from 'date-fns';
import { motion } from 'motion/react';
import { CloseCircleSvg } from './Svgs';
function PreviewModal({ func, note }) {
  const { setPreviewNote, setIsPreviewModalShowing } = func;
  const { text, title, trashedAt } = note;
  const trashedAtDate = isToday(trashedAt.toDate()) ? format(trashedAt.toDate(), 'h:mm a') : `${format(trashedAt.toDate(), 'h:mm a')}, ${format(trashedAt.toDate(), 'dd-MMM-yy')}`;

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
      }}
      transition={{
        duration: 0.2,
      }}
      className="fixed inset-0 z-10 grid place-items-center overflow-y-auto bg-black/30 p-4 duration-150 dark:bg-white/10 [@media(pointer:fine)]:backdrop-blur-[3px]"
      onMouseDown={() => setIsPreviewModalShowing(false)}
    >
      <div onMouseDown={(e) => e.stopPropagation()} className="relative grid w-full max-w-[600px] gap-4 rounded-xl bg-zinc-100 p-5 pt-7 shadow-xl dark:bg-zinc-900">
        <div className="grid gap-2">
          <span className="text-lg font-medium">{title || 'Untitled'}</span>
          <p className="max-h-[500px] overflow-y-auto break-words">{text || 'Empty'}</p>
        </div>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">Trashed at {trashedAtDate}</span>

        <button onClick={() => setIsPreviewModalShowing(false)} className="absolute top-2 right-2 z-5 grid cursor-pointer place-items-center transition-opacity hover:opacity-100 active:translate-y-[1px] [@media(pointer:fine)]:opacity-70">
          <CloseCircleSvg width="24" height="24" />
          <span className="absolute -inset-2 [@media(pointer:fine)]:hidden"></span>
        </button>
      </div>
    </motion.div>
  );
}

export default PreviewModal;
