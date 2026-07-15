# WALLy Street — Frontend (React + Vite)

Segunda entrega (reentrega) del Seminario de Lenguajes — Opción PHP, React y API Rest — UNLP 2026.

Consume la API REST construida con Slim (primera entrega).

## Librerías externas

### react-router-dom
Manejo de rutas y navegación entre páginas sin recarga del navegador.

npm install react-router-dom

### axios
Cliente HTTP para consumir los endpoints de la API REST. Permite configurar una instancia global con la URL base y el token de autenticación automático mediante interceptores.

npm install axios

## Estructura del proyecto

src/
├── assets/
│   ├── images/             → imágenes del proyecto (logo)
│   └── styles/             → variables CSS y estilos globales
├── components/
│   ├── AssetTable/         → tabla reutilizable de activos con filtro y orden
│   ├── EvolutionBadge/     → indicador de evolución de precio (▲ ▼ —)
│   ├── FooterComponent/
│   ├── HeaderComponent/
│   ├── Modal/              → modal genérico reutilizable
│   ├── NavBarComponent/
│   └── PriceTag/           → formato de precio reutilizable ($XX.XX)
├── config/
│   └── api.js              → instancia global de Axios con baseURL e interceptores
├── context/
│   └── AuthContext.jsx     → estado global de sesión (token, usuario)
├── hooks/
│   └── useAssetEvolution.js → hook para fetch de activos con evolución de precios
├── pages/
│   ├── editar-usuario/
│   ├── login/
│   ├── operaciones/
│   ├── panel/
│   ├── portfolio/
│   ├── registro/
│   ├── stat/
│   └── usuarios/
├── router/
│   └── ProtectedRoute.jsx  → guards de rutas (login y admin)
├── services/
│   ├── asset.services.js
│   ├── auth.services.js
│   ├── portfolio.services.js
│   ├── transaction.services.js
│   └── user.services.js
└── utils/
    ├── constants.js        → constantes globales (REFRESH_INTERVAL_MS)
    └── validations.js      → funciones de validación reutilizables

## Cambios respecto a la primera entrega

### Reorganización de carpetas
- `api.js` movido a `src/config/` para separar la configuración de Axios de los servicios
- Creada carpeta `src/services/` con un archivo por feature (`asset.services.js`, `auth.services.js`, `portfolio.services.js`, `transaction.services.js`, `user.services.js`). Los componentes ya no llaman a la API directamente sino a través de estos servicios
- `ProtectedRoute` movido a `src/router/` ya que es lógica de ruteo y no un componente de UI
- Funciones de validación extraídas a `src/utils/validations.js`

### Nuevos componentes reutilizables
- `Modal` — modal genérico usado en Portfolio (confirmación de eliminación) y Panel (compra e historial de precios)
- `AssetTable` — tabla de activos con filtro y orden, usada en StatPage y PanelPage
- `PriceTag` — formato de precio con fuente monoespaciada, usado en todas las páginas que muestran valores monetarios
- `EvolutionBadge` — indicador visual de evolución de precio (▲ ▼ —) con colores

### Nuevo custom hook
- `useAssetEvolution` — encapsula la lógica de fetch de activos, detección de evolución de precios usando `sessionStorage` para persistir precios entre navegaciones, y auto-refresh cada 3 minutos. Usado en StatPage y PanelPage

### Filtros de assets
- Los filtros por nombre y precio se realizan llamando al endpoint `GET /assets` con query params (`?type=`, `?min_price=`, `?max_price=`) en vez de filtrar en el frontend
- Se agregó un botón "Buscar" para que el filtro se aplique al enviarlo y no en cada keystroke
- El ordenamiento por nombre y precio se mantiene en el frontend

### UX
- Mensaje de confirmación al comprar y vender desde Portfolio y Panel
- Modal de confirmación antes de eliminar un activo del portfolio
- `useTransition` en todas las páginas para manejar estados de carga sin estados `loading` adicionales

## Modificaciones al backend

### POST /login — AuthController.php
Se agregaron los campos id, name, is_admin y balance a la respuesta para que el frontend pueda identificar al usuario logueado sin necesitar un request adicional.

### GET /portfolio — Portfolio.php
Se agregó p.asset_id al SELECT para que el frontend pueda identificar cada activo y realizar operaciones de compra, venta y eliminación.

### GET /transactions — Transaction.php
Se reemplazó SELECT * por un SELECT con JOIN a la tabla assets para incluir a.name as asset_name, evitando que el frontend tenga que resolver el nombre del activo por separado.

### GET /users — User.php
Se agregó u.id al SELECT para que el admin pueda acceder a la pantalla de edición de cada usuario.

## Autores

Juan Blas González Seijas · Valentín Lumbreras