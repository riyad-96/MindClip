import UserContextProvider from './UserContextProvider';
import NotesContextProvider from './NotesContextProvider';


function ContextProviders({ children }) {
  return (
    <UserContextProvider>
      <NotesContextProvider>
        {children}
      </NotesContextProvider>
    </UserContextProvider>
  );
}

export default ContextProviders;
