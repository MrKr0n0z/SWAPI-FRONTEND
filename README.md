# SWAPI Client - Frontend React

Cliente web React para consumir la API de Laravel del examen SWAPI.

## 🚀 Características Implementadas

### 1. Configuración de Axios ✅
- **Instancia configurada** con base URL `http://127.0.0.1:8000`
- **Interceptor de Request**: Inyección automática del token Bearer desde localStorage
- **Interceptor de Response**: 
  - Error 401 → Limpia localStorage y redirige a `/login`
  - Error 429 → Muestra alerta "Has excedido el límite de peticiones"

### 2. Página de Login ✅
- Formulario limpio con email/password
- Guarda token y usuario en localStorage al autenticarse
- Redirige al Home tras login exitoso
- Manejo de errores de autenticación

### 3. Home/Bienvenida (Ruta Protegida) ✅
- Mensaje de bienvenida con nombre del usuario
- Muestra rol del usuario
- Muestra último acceso
- Menú de navegación a las 6 entidades SWAPI

### 4. Listado de Entidades ✅
- **Entidades soportadas**: Films, People, Planets, Species, Starships, Vehicles
- **Componente reutilizable** `EntityList.jsx`
- **Paginación completa**: Botones Anterior/Siguiente con parámetros `?page=X`
- **Tabla responsive** con datos principales de cada entidad
- Enlace a detalle desde cada ítem

### 5. Detalle de Entidades ✅
- Rutas dinámicas `/:entityType/:id`
- Muestra todos los campos de la entidad
- Navegación de vuelta a la lista
- Formateo inteligente de datos

### 6. Sistema de Rutas Protegidas ✅
- Componente `ProtectedRoute` para verificar autenticación
- Redirección automática a login si no hay token
- React Router DOM configurado correctamente

## 📁 Estructura del Proyecto

```
src/
├── api/
│   └── axios.js              # Configuración de interceptores
├── components/
│   └── ProtectedRoute.jsx    # Componente de rutas protegidas
├── pages/
│   ├── LoginPage.jsx         # Página de login
│   ├── HomePage.jsx          # Página de inicio/bienvenida
│   ├── EntityList.jsx        # Lista de entidades (reutilizable)
│   └── EntityDetail.jsx      # Detalle de entidades
├── App.jsx                   # Configuración de rutas principales
└── main.jsx                  # Punto de entrada de la aplicación
```

## 🛠️ Tecnologías Utilizadas

- **React 19** con Vite
- **React Router DOM 7** para navegación
- **Axios** para peticiones HTTP
- **CSS Modular** para estilos
- **JWT Decode** para manejo de tokens

## ⚙️ Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🔗 Endpoints de la API

La aplicación consume los siguientes endpoints de tu API Laravel:

- `POST /api/login` - Autenticación
- `GET /api/v1/{entity}` - Listado paginado
- `GET /api/v1/{entity}/{id}` - Detalle específico
- `POST /api/sync` - Sincronización (no implementado en frontend)

## 🎯 Funcionalidades de Usuario

### Login
1. Accede a `http://localhost:5173/login`
2. Introduce email y password
3. La aplicación guarda el token automáticamente

### Navegación
1. **Home**: Información del usuario y menú principal
2. **Listas**: Accede a cualquiera de las 6 entidades
3. **Paginación**: Navega entre páginas de resultados
4. **Detalles**: Haz clic en "Ver detalle" para información completa
5. **Logout**: Botón para cerrar sesión

### Entidades Disponibles
- 🎬 **Películas** (`/films`)
- 👥 **Personas** (`/people`) 
- 🪐 **Planetas** (`/planets`)
- 🧬 **Especies** (`/species`)
- 🚀 **Naves** (`/starships`)
- 🚗 **Vehículos** (`/vehicles`)

## 🔒 Seguridad

- **Autenticación automática**: Token Bearer en todas las peticiones
- **Rutas protegidas**: Requieren autenticación válida
- **Manejo de errores**: 401/429 con acciones automáticas
- **Logout seguro**: Limpia localStorage completamente

## 🎨 Características UI/UX

- **Diseño responsive** que funciona en móvil y desktop
- **Gradientes y sombras** para una interfaz moderna
- **Estados de carga** y mensajes de error informativos
- **Navegación intuitiva** con breadcrumbs y botones de retorno
- **Tablas paginadas** para grandes conjuntos de datos

¡El cliente está listo para conectar con tu API de Laravel! 🚀
