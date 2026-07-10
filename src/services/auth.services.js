import api from '../config/api';

export const loginService = (form) => api.post('/login', form);

export const logoutService = () => api.post('/logout');

export const registroService = (form) => api.post('/users', form);