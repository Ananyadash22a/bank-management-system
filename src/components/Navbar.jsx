import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <Wallet className="text-gradient" size={28} />
                <span>NextGen Bank</span>
            </Link>
            
            <div className="nav-links">
                {user ? (
                    <>
                        <span style={{ color: 'var(--text-muted)' }}>Welcome, {user.username}</span>
                        {user.role === 'ROLE_ADMIN' ? (
                            <Link to="/admin" className="nav-link flex-between" style={{gap: '0.5rem'}}>
                                <ShieldAlert size={18}/> Admin
                            </Link>
                        ) : (
                            <Link to="/dashboard" className="nav-link flex-between" style={{gap: '0.5rem'}}>
                                <LayoutDashboard size={18}/> Dashboard
                            </Link>
                        )}
                        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
