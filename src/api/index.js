import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProjects = () => {
  return client.get('/projects?_embed=tasks');
};

export const fetchTasks = () => {
  return client.get('/tasks');
};

export const createTask = (params) => {
  return client.post('./tasks', params);
};

export const editTask = (id, params) => {
  return client.put(`./tasks/${id}`, params);
};
