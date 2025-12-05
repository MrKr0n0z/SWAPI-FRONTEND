import axios from 'axios';

// Crear instancia de axios configurada
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false,
  timeout: 10000,
});

// Interceptor de Request - Inyectar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Asegurarse de que no se envíen cookies de sesión
    config.headers['Cache-Control'] = 'no-cache';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Manejo de errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Token expirado o no autorizado
      if (status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Límite de peticiones excedido
      if (status === 429) {
        window.alert('Has excedido el límite de peticiones. Por favor, intenta más tarde.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;