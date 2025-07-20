import { useCallback, useEffect, useState } from 'react';
import { useNotes, useUser } from '../contexts/contexts';
import { DeleteForeverSvg, LoaderSvg, RestoreFromTrashSvg, TrashSvg } from './Svgs';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import EachTrashNote from './EachTrashNote';
function Trash() {
  const { user } = useUser();
  const { trashes, setTrashes } = useNotes();

  const [isTrashLoading, setIsTrashLoading] = useState(true);

  const fetchUserTrashedNotes = useCallback(async () => {
    const trashedNoteCollectionRef = collection(db, 'users', user.uid, 'trash');

    try {
      const trashedNotes = await getDocs(trashedNoteCollectionRef);
      const trashArray = [];
      trashedNotes.forEach((doc) => {
        const obj = {
          id: doc.id,
          ...doc.data(),
        };
        trashArray.push(obj);
      });
      console.log(trashArray);
      setTrashes(trashArray);
      setIsTrashLoading(false);
    } catch (error) {
      console.error(error);
      setIsTrashLoading(false);
    }
  }, [user.uid, setTrashes]);

  useEffect(() => {
    fetchUserTrashedNotes();
  }, [fetchUserTrashedNotes]);

  return (
    <div>
      <div className="flex h-[60px] items-center justify-between">
        <h1 className="text-[length:clamp(1.325rem,1.1121rem+0.7921vw,1.825rem)] font-medium">Trash</h1>
        <div className="flex items-center justify-end gap-2">
          <button className="h-[30px] cursor-pointer rounded-md text-zinc-600 hover:text-zinc-800 border-1 border-zinc-300 bg-zinc-200 px-1 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]">
            <RestoreFromTrashSvg width="24" height="24" />
          </button>
          <button className="h-[30px] cursor-pointer rounded-md text-zinc-600 hover:text-zinc-800 border-1 border-zinc-300 bg-zinc-200 px-1 text-sm transition-colors hover:bg-zinc-300 active:translate-y-[1px]">
            <DeleteForeverSvg width="24" height="24" />
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh_-_120px)] overflow-y-auto rounded-lg border border-zinc-200 p-2">
        {isTrashLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <LoaderSvg className="animate-spin" width="30" height="30" />
          </div>
        ) : trashes.length === 0 ? (
          <div className="grid h-[200px] content-center justify-items-center gap-2 md:h-[300px]">
            <span className="opacity-80">No notes in trash</span>
            <TrashSvg width="100" height="100" className="opacity-30" />
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
            {trashes.map((note) => (
              <EachTrashNote key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Trash;
