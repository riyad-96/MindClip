import { useUser } from '../contexts/UserContextProvider';
import { Navigate } from 'react-router-dom';

function HomeProtectedRoute({ children }) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/auth/log-in" replace />;
  }
  return children;
}

export default HomeProtectedRoute;
