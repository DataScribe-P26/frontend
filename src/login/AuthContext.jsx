import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on mount and route changes
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!storedToken || !storedUser) {
        // Clear everything if either token or user is missing
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        
        // Only redirect if we're not already on a public route
        if (!isPublicRoute(location.pathname)) {
          navigate('/login', { replace: true });
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [location, navigate]);

  // Prevent authenticated users from accessing login/register pages
  useEffect(() => {
    if (token && isPublicRoute(location.pathname)) {
      navigate('/home', { replace: true });
    }
  }, [token, location, navigate]);

  const login = (accessToken, userData) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    navigate('/home', { replace: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  };

  const isPublicRoute = (path) => {
    const publicRoutes = ['/', '/login', '/register','/price'];
    return publicRoutes.includes(path);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900"></div>
    </div>;
  }

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};