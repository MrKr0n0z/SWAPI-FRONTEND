import { useState } from 'react';
import axios from 'axios';
import apiClient from '../api/axios';
import './SyncPage.css';

const SyncPage = () => {
  const [entity, setEntity] = useState('people');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const entities = [
    { value: 'people', label: 'Personas' },
    { value: 'films', label: 'Películas' },
    { value: 'planets', label: 'Planetas' },
    { value: 'species', label: 'Especies' },
    { value: 'starships', label: 'Naves' },
    { value: 'vehicles', label: 'Vehículos' },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!id.trim()) {
      setError('Por favor ingresa un ID válido');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);
    setSuccess(false);

    try {
      // Buscar en la API externa de SWAPI
      const response = await axios.get(
        `https://swapi.dev/api/${entity}/${id}/`
      );
      setData(response.data);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? `No se encontró el ${entity} con ID ${id}`
          : 'Error al buscar en la API externa. Verifica tu conexión.'
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError('');

    try {
      // Enviar a la API local para sincronizar
      await apiClient.post('/api/sync', {
        entity,
        id,
        data,
      });
      
      setSuccess(true);
      setTimeout(() => {
        setId('');
        setData(null);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Error al sincronizar en la base de datos local'
      );
    } finally {
      setSyncing(false);
    }
  };

  const getTitle = () => {
    return data?.name || data?.title || 'Elemento de SWAPI';
  };

  return (
    <div className="sync-page">
      {/* Header */}
      <div className="sync-header">
        <div className="sync-header-content">
          <h1 className="sync-title">🌌 Sincronización Galáctica</h1>
          <p className="sync-subtitle">
            Busca datos en SWAPI y sincronízalos con tu base de datos local
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="sync-container">
        {/* Error Toast */}
        {error && (
          <div className="sync-error-toast">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} className="sync-toast-close">✕</button>
          </div>
        )}

        {/* Success Toast */}
        {success && (
          <div className="sync-success-toast">
            <span>✅ Sincronizado exitosamente</span>
          </div>
        )}

        {/* Search Panel */}
        <div className="sync-panel">
          <h2 className="sync-panel-title">Búsqueda</h2>
          
          <form onSubmit={handleSearch} className="sync-form">
            {/* Entity Select */}
            <div className="sync-form-group">
              <label htmlFor="entity" className="sync-label">
                Entidad
              </label>
              <select
                id="entity"
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                className="sync-select"
              >
                {entities.map((ent) => (
                  <option key={ent.value} value={ent.value}>
                    {ent.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ID Input */}
            <div className="sync-form-group">
              <label htmlFor="id" className="sync-label">
                ID
              </label>
              <input
                id="id"
                type="number"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Ej: 1"
                className="sync-input"
                disabled={loading}
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="sync-button-search"
            >
              {loading ? (
                <>
                  <span className="sync-spinner"></span>
                  Buscando...
                </>
              ) : (
                <>🔍 Buscar</>
              )}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="sync-results">
          {!data && !loading && (
            <div className="sync-empty-state">
              <div className="sync-empty-icon">📡</div>
              <p className="sync-empty-text">Esperando transmisión...</p>
              <p className="sync-empty-subtext">
                Busca un elemento para ver una vista previa
              </p>
            </div>
          )}

          {loading && (
            <div className="sync-loading-state">
              <div className="sync-skeleton">
                <div className="sync-skeleton-header"></div>
                <div className="sync-skeleton-lines">
                  <div className="sync-skeleton-line"></div>
                  <div className="sync-skeleton-line"></div>
                  <div className="sync-skeleton-line"></div>
                </div>
              </div>
            </div>
          )}

          {data && !loading && (
            <div className="sync-card">
              {/* Card Header */}
              <div className="sync-card-header">
                <h3 className="sync-card-title">{getTitle()}</h3>
                <p className="sync-card-entity">
                  {entities.find((e) => e.value === entity)?.label} • ID: {id}
                </p>
              </div>

              {/* Card Content - JSON Display */}
              <div className="sync-card-content">
                <pre className="sync-json-display">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>

              {/* Card Footer - Action Button */}
              <div className="sync-card-footer">
                <button
                  onClick={handleSync}
                  disabled={syncing || success}
                  className="sync-button-sync"
                >
                  {success ? (
                    <>✅ Sincronizado</>
                  ) : syncing ? (
                    <>
                      <span className="sync-spinner-small"></span>
                      Sincronizando...
                    </>
                  ) : (
                    <>💾 Guardar en Base de Datos</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncPage;