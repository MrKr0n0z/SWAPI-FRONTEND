import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/axios';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Limpiar cualquier token previo antes del login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Crear petición especial para login completamente limpia
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false,
        timeout: 10000,
      });
      
      // Guardar token y usuario en localStorage (estructura correcta de tu API)
      localStorage.setItem('accessToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      // Redirigir al home
      navigate('/');
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Error de conexión. Verifica que la API esté ejecutándose en http://127.0.0.1:8000');
      } else if (err.response?.status === 405) {
        setError('Error de método HTTP. Verifica la configuración de rutas en Laravel.');
      } else if (err.response?.status === 422) {
        setError('Datos inválidos. Verifica email y contraseña.');
      } else if (err.response?.status === 419 || err.response?.data?.message?.includes('CSRF')) {
        setError('Error CSRF. La ruta debe estar en routes/api.php sin middleware web.');
      } else {
        const message = err.response?.data?.message || 'Error de autenticación. Verifica tus credenciales.';
        const example = err.response?.data?.example;
        
        if (example) {
          setError(`${message} - Ejemplo esperado: ${JSON.stringify(example.body)}`);
        } else {
          setError(message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;