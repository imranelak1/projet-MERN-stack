// src/services/mockApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Replace with your backend URL

export const api = {
  getTasks: (userId) => 
    axios.get(`${BASE_URL}/getAlltasks?userId=${userId}`).then((res) => res.data),
  createTask: (task) => 
    axios.post(`${BASE_URL}/createTask`, task).then((res) => res.data),
  updateTask: (id, updates) => 
    axios.put(`${BASE_URL}/${id}`, updates).then((res) => res.data), // Matches your /:id route
  deleteTask: (id) => 
    axios.delete(`${BASE_URL}/${id}`).then((res) => res.data), // Matches your /:id route
};

