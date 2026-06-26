import axios from "axios";

// REQUISITO OBLIGATORIO: Variable constante global para el tiempo de refresco (3 minutos = 180000 ms)
export const REFRESH_TIME_ASSETS = 180000;

// Configuración centralizada de Axios apuntando a tu variable de entorno
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});