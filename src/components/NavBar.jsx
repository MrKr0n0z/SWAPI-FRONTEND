import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/films', label: 'Películas', icon: '🎬' },
    { path: '/people', label: 'Personas', icon: '👥' },
    { path: '/planets', label: 'Planetas', icon: '🪐' },
    { path: '/species', label: 'Especies', icon: '🧬' },
    { path: '/starships', label: 'Naves', icon: '🚀' },
    { path: '/vehicles', label: 'Vehículos', icon: '🚗' },
    { path: '/sync', label: 'Sincronización', icon: '🌌' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          ⭐ SWAPI Client
        </Link>

        {/* Menu Toggle Button (Mobile) */}
        <button
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}></span>
        </button>

        {/* Nav Items */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="navbar-items">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-item ${isActive(item.path)}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="navbar-icon">{item.icon}</span>
                <span className="navbar-label">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="navbar-logout"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;