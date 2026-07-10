import api from '../config/api';

export const getUserService = (userId) => api.get(`/users/${userId}`); 

export const getAllUsersService = () => api.get('/users');

export const createUserService = (form) => api.post('/users', form);

export const updateUserService = (userId, payload) => api.put(`/users/${userId}`, payload);

export const deleteUserService = (userId) => api.delete(`/users/${userId}`);