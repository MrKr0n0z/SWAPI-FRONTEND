import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import './EntityList.css';

const EntityList = () => {
  const { entityType } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10
  });

  const entityConfig = {
    films: { title: 'Películas', fields: ['title', 'director', 'release_date'] },
    people: { title: 'Personas', fields: ['name', 'height', 'mass', 'gender'] },
    planets: { title: 'Planetas', fields: ['name', 'diameter', 'climate', 'terrain'] },
    species: { title: 'Especies', fields: ['name', 'classification', 'language'] },
    starships: { title: 'Naves', fields: ['name', 'model', 'manufacturer'] },
    vehicles: { title: 'Vehículos', fields: ['name', 'model', 'manufacturer'] },
  };

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.get(`/api/v1/${entityType}?page=${page}`);
      
      setData(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page
      });
    } catch (err) {
      setError('Error al cargar los datos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityType && entityConfig[entityType]) {
      fetchData();
    } else {
      setError('Tipo de entidad no válido');
      setLoading(false);
    }
  }, [entityType]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchData(newPage);
    }
  };

  const config = entityConfig[entityType];

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Link to="/" className="back-button">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="entity-list-container">
      <header className="entity-header">
        <div className="header-content">
          <Link to="/" className="back-link">← Volver</Link>
          <h1>{config.title}</h1>
        </div>
      </header>

      <main className="entity-main">
        <div className="list-info">
          <p>Total: {pagination.total} elementos</p>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {config.fields.map(field => (
                  <th key={field}>{field.replace('_', ' ').toUpperCase()}</th>
                ))}
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  {config.fields.map(field => (
                    <td key={field}>{item[field] || 'N/A'}</td>
                  ))}
                  <td>
                    <Link 
                      to={`/${entityType}/${item.id}`}
                      className="detail-button"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="pagination-button"
          >
            ← Anterior
          </button>
          
          <span className="pagination-info">
            Página {pagination.currentPage} de {pagination.lastPage}
          </span>
          
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.lastPage}
            className="pagination-button"
          >
            Siguiente →
          </button>
        </div>
      </main>
    </div>
  );
};

export default EntityList;