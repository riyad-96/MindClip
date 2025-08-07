import { motion } from 'motion/react';

function DeleteModal({ func, texts }) {
  const { setIsDeleteModalShowing, deleteNotes } = func;
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
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4 dark:bg-white/10 [@media(pointer:fine)]:backdrop-blur-[3px]"
      onMouseDown={() => setIsDeleteModalShowing(false)}
    >
      <div onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-[400px] rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
        <span className="block border-b-1 border-zinc-200 px-4 py-3 text-lg font-medium dark:border-zinc-700">Delete this note !</span>
        <div className="space-y-6 px-4 py-4">
          <span className="block leading-snug text-zinc-700 dark:text-zinc-300">This action is irrevarsible. {texts}</span>
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsDeleteModalShowing(false)} className="h-[35px] cursor-pointer rounded-full border border-zinc-300 bg-zinc-200 px-5 text-sm tracking-wide transition-colors hover:bg-zinc-300 active:translate-y-[1px] dark:border-zinc-600 dark:bg-zinc-700 dark:hover:bg-zinc-600">
              Cancel
            </button>
            <button onClick={deleteNotes} className="h-[35px] cursor-pointer rounded-full border border-red-600 bg-red-500 px-5 text-sm tracking-wide text-white transition-colors hover:border-red-400 hover:bg-red-400 active:translate-y-[1px]">
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DeleteModal;
