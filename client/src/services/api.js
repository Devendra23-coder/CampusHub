import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campushub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('campushub_token');
      localStorage.removeItem('campushub_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  loginUser: (data) => api.post('/auth/login', data),
  registerUser: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const events = {
  getEvents: () => api.get('/events'),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

export const registrations = {
  registerForEvent: (data) => api.post('/registrations', data),
  getMyRegistrations: () => api.get('/registrations/my'),
  cancelRegistration: (id) => api.put(`/registrations/${id}/cancel`),
  getEventRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
};

export const clubs = {
  getClubs: () => api.get('/clubs'),
  getClub: (id) => api.get(`/clubs/${id}`),
  createClub: (data) => api.post('/clubs', data),
  updateClub: (id, data) => api.put(`/clubs/${id}`, data),
  deleteClub: (id) => api.delete(`/clubs/${id}`),
};

export const announcements = {
  getAnnouncements: () => api.get('/announcements'),
  createAnnouncement: (data) => api.post('/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

export const users = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUsers: () => api.get('/users'),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const attendance = {
  markAttendance: (data) => api.post('/attendance', data),
  getEventAttendance: (eventId) => api.get(`/attendance/event/${eventId}`),
};

export const notifications = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export default api;
