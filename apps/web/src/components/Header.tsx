import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="text-xl font-bold hover:text-blue-200"
          >
            Inventory
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="hover:text-blue-200"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="hover:text-blue-200"
            >
              Categories
            </Link>
            {user ? (
              <>
                <span className="text-sm">
                  Logged in as {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
