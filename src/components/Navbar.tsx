import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div className="flex gap-6">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Paychecks
          </Link>
          <Link to="/calculator" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Calculator
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}