import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import EntityList from './pages/EntityList';
import EntityDetail from './pages/EntityDetail';
import SyncPage from './pages/SyncPage';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import './App.css';

function AppContent() {
  const location = useLocation();
  const showNavBar = location.pathname !== '/login';

  return (
    <div className="App">
      {showNavBar && <NavBar />}
      <Routes>
        {/* Ruta de login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de listas de entidades */}
        <Route 
          path="/:entityType" 
          element={
            <ProtectedRoute>
              <EntityList />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de detalle de entidades */}
        <Route 
          path="/:entityType/:id" 
          element={
            <ProtectedRoute>
              <EntityDetail />
            </ProtectedRoute>
          } 
        />

        {/* Ruta de sincronización */}
        <Route 
          path="/sync" 
          element={
            <ProtectedRoute>
              <SyncPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirigir rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
