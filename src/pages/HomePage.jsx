import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleString('es-ES');
  };

  if (!user) return <div>Cargando...</div>;

  const entities = [
    { name: 'Películas', path: 'films', icon: '🎬' },
    { name: 'Personas', path: 'people', icon: '👥' },
    { name: 'Planetas', path: 'planets', icon: '🪐' },
    { name: 'Especies', path: 'species', icon: '🧬' },
    { name: 'Naves', path: 'starships', icon: '🚀' },
    { name: 'Vehículos', path: 'vehicles', icon: '🚗' },
  ];

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>SWAPI Client</h1>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="home-main">
        <div className="welcome-section">
          <h2>Bienvenido, {user.name}</h2>
          <div className="user-info">
            <p><strong>Tu Rol:</strong> {user.role}</p>
            <p><strong>Último acceso:</strong> {formatDate(user.last_login_at)}</p>
          </div>
        </div>

        <div className="entities-grid">
          <h3>Explorar Entidades</h3>
          <div className="grid">
            {entities.map((entity) => (
              <Link
                key={entity.path}
                to={`/${entity.path}`}
                className="entity-card"
              >
                <div className="entity-icon">{entity.icon}</div>
                <h4>{entity.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;