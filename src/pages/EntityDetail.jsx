import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios';
import './EntityDetail.css';

const EntityDetail = () => {
  const { entityType, id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const entityConfig = {
    films: 'Película',
    people: 'Persona',
    planets: 'Planeta',
    species: 'Especie',
    starships: 'Nave',
    vehicles: 'Vehículo',
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await apiClient.get(`/api/v1/${entityType}/${id}`);
        setData(response.data);
      } catch (err) {
        setError('Error al cargar el detalle: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [entityType, id]);

  const formatValue = (key, value) => {
    if (!value || value === 'unknown' || value === 'n/a') {
      return 'No disponible';
    }
    
    if (key.includes('date')) {
      return new Date(value).toLocaleDateString('es-ES');
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return value.toString();
  };

  const formatKey = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return <div className="loading">Cargando detalle...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Link to={`/${entityType}`} className="back-button">Volver a la lista</Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-container">
        <p className="error-message">No se encontró el elemento</p>
        <Link to={`/${entityType}`} className="back-button">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <header className="detail-header">
        <div className="header-content">
          <Link to={`/${entityType}`} className="back-link">← Volver a {entityConfig[entityType]}s</Link>
          <h1>{data.name || data.title}</h1>
        </div>
      </header>

      <main className="detail-main">
        <div className="detail-card">
          <h2>Información de {entityConfig[entityType]}</h2>
          <div className="detail-grid">
            {Object.entries(data)
              .filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key))
              .map(([key, value]) => (
                <div key={key} className="detail-item">
                  <span className="detail-label">{formatKey(key)}:</span>
                  <span className="detail-value">{formatValue(key, value)}</span>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EntityDetail;