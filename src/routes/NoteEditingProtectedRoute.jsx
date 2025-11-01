import { useNotes } from '../contexts/NotesContextProvider';

function NoteEditingProtectedRoute({ children }) {
  const { notesLoading } = useNotes();
  if (notesLoading) {
    return <div className="absolute inset-0 top-0 left-0 z-5"></div>;
  }
  return children;
}

export default NoteEditingProtectedRoute;
