import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import EntityList from './pages/EntityList';
import EntityDetail from './pages/EntityDetail';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
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
          
          {/* Redirigir rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
