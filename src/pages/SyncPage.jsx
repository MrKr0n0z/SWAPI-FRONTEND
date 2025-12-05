import { useState, useEffect } from 'react';
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
  const [listItems, setListItems] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const entities = [
    { value: 'people', label: 'Personas' },
    { value: 'films', label: 'Películas' },
    { value: 'planets', label: 'Planetas' },
    { value: 'species', label: 'Especies' },
    { value: 'starships', label: 'Naves' },
    { value: 'vehicles', label: 'Vehículos' },
  ];

  const fetchList = async (selectedEntity) => {
    setListLoading(true);
    try {
      const response = await axios.get(`https://swapi.dev/api/${selectedEntity}/?page=1`);
      const mapped = (response.data?.results || []).map((item) => {
        const match = item.url?.match(/\/(\d+)\/?$/);
        return { ...item, __id: match ? match[1] : 'N/A' };
      });
      setListItems(mapped);
    } catch (err) {
      setListItems([]);
      setError('Error al cargar la lista de ' + selectedEntity);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchList(entity);
    setId('');
    setData(null);
    setSuccess(false);
  }, [entity]);

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

  const handleSelectItem = (item) => {
    setError('');
    setSuccess(false);
    setId(item.__id || '');
    setData(item);
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

      {/* Entity Tabs */}
      <div className="sync-tabs" role="tablist">
        {entities.map((ent) => (
          <button
            key={ent.value}
            type="button"
            className={`sync-tab ${entity === ent.value ? 'active' : ''}`}
            onClick={() => setEntity(ent.value)}
          >
            {ent.label}
          </button>
        ))}
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

        {/* Catálogo por entidad */}
        <div className="sync-catalog">
          <div className="sync-catalog-header">
            <h3>Catálogo de {entities.find((e) => e.value === entity)?.label}</h3>
            <p>Selecciona un elemento para previsualizar y sincronizar</p>
          </div>

          {listLoading && (
            <div className="sync-grid-loading">
              <div className="sync-skeleton-card" />
              <div className="sync-skeleton-card" />
              <div className="sync-skeleton-card" />
            </div>
          )}

          {!listLoading && listItems.length === 0 && (
            <p className="sync-catalog-empty">No hay elementos para mostrar.</p>
          )}

          <div className="sync-grid">
            {listItems.map((item) => (
              <div key={item.__id} className="sync-mini-card">
                <div className="sync-mini-id">ID: {item.__id}</div>
                <h4 className="sync-mini-title">{item.name || item.title}</h4>
                <div className="sync-mini-meta">
                  <span>{item.gender || item.director || item.model || 'Detalle'}</span>
                  <span>{item.birth_year || item.release_date || item.manufacturer || ''}</span>
                </div>
                <button
                  type="button"
                  className="sync-mini-button"
                  onClick={() => handleSelectItem(item)}
                >
                  Ver detalle
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="sync-results">
          {!data && !loading && (
            <div className="sync-empty-state">
              <div className="sync-empty-icon">📡</div>
              <p className="sync-empty-text">Esperando transmisión...</p>
              <p className="sync-empty-subtext">
                Selecciona una tarjeta o busca por ID para ver una vista previa
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