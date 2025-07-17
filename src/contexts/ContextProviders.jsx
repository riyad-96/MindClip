import IsLoggedInContextProvider from './IsLoggedInContextProvider'
import UserContextProvider from './UserContextProvider'
import NotesContextProvider from './NotesContextProvider'

function ContextProviders({ children }) {
  return (
    <IsLoggedInContextProvider>
      <UserContextProvider>
        <NotesContextProvider>
          {children}
        </NotesContextProvider>
      </UserContextProvider>
    </IsLoggedInContextProvider>
  )
}

export default ContextProviders;