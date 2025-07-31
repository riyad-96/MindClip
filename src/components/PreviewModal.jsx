import { format, isToday } from 'date-fns';
import { motion } from 'motion/react';
import { CloseCircleSvg } from './Svgs';
function PreviewModal({ func, note }) {
  const { setPreviewNote, setIsPreviewModalShowing } = func;
  const { text, title, trashedAt } = note;
  const trashedAtDate = isToday(trashedAt.toDate()) ? format(trashedAt.toDate(), 'h:mm a') : `${format(trashedAt.toDate(), 'h:mm a')}, ${format(trashedAt.toDate(), 'dd-MMM-yy')}` ;

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
      className="fixed inset-0 z-10 grid place-items-center overflow-y-auto bg-black/30 p-4"
      onMouseDown={() => setIsPreviewModalShowing(false)}
    >
      <div onMouseDown={(e) => e.stopPropagation()} className="relative grid gap-4 w-full max-w-[600px] rounded-xl bg-zinc-100 p-5 pt-7 shadow-xl">
        <div className="grid gap-2">
          <span className="text-lg font-medium">{title || 'Untitled'}</span>
          <p className="max-h-[500px] overflow-y-auto break-words">{text || 'Empty'}</p>
        </div>
        <span className="text-zinc-600 text-sm">Trashed at {trashedAtDate}</span>

        <button onClick={() => setIsPreviewModalShowing(false)} className="absolute right-2 [@media(pointer:fine)]:opacity-70 hover:opacity-100 active:translate-y-[1px] transition-opacity top-2 z-5 grid place-items-center cursor-pointer">
          <CloseCircleSvg width="24" height="24" />
          <span className="absolute -inset-2 [@media(pointer:fine)]:hidden"></span>
        </button>
      </div>
    </motion.div>
  );
}

export default PreviewModal;
