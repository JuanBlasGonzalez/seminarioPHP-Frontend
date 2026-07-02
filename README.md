# WALLy Street — Frontend (React + Vite)

Segunda entrega Seminario de Lenguajes — Opción PHP, React y API Rest — UNLP 2026.

Consume la API REST construida con Slim (primera entrega).

## ⚙️ Instalación

```bash
npm install
npm run dev
```

Por defecto levanta en `http://localhost:5173`.

Configurar la URL del backend en el archivo `.env` en la raíz del proyecto:
VITE_API_BASE_URL=http://localhost/seminariophp

## 📦 Librerías externas

### react-router-dom
Manejo de rutas y navegación entre páginas sin recarga del navegador.

```bash
npm install react-router-dom
```

### axios
Cliente HTTP para consumir los endpoints de la API REST. Permite configurar una instancia global con la URL base y el token de autenticación.

```bash
npm install axios
```

## 🔧 Modificaciones al backend

### POST /login — `AuthController.php`
Se agregaron los campos `id`, `name`, `is_admin` y `balance` a la respuesta para que el frontend pueda identificar al usuario logueado sin necesitar un request adicional.

### GET /portfolio — `Portfolio.php`
Se agregó `p.asset_id` al SELECT para que el frontend pueda identificar cada activo y realizar operaciones de compra, venta y eliminación.

### GET /transactions — `Transaction.php`
Se reemplazó `SELECT *` por un SELECT con JOIN a la tabla `assets` para incluir `a.name as asset_name`, evitando que el frontend tenga que resolver el nombre del activo por separado.

### GET /users — `User.php`
Se agregó `u.id` al SELECT para que el admin pueda acceder a la pantalla de edición de cada usuario.

## 👥 Autores

Juan Blas Gonzalez Seijas · Valentin Lumbreras