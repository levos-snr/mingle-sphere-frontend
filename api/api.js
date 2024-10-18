import axios from 'axios';

const API_BASE_URL = '/api';  // This will be proxied to your backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  throw error;
};

// Index
export const getIndex = () => api.get('/').catch(handleApiError);

// Auth
export const register = (userData) => api.post('/register', userData).catch(handleApiError);
export const login = (credentials) => api.post('/login', credentials).catch(handleApiError);

// Users
export const getUsers = () => api.get('/users').catch(handleApiError);
export const getUser = (userId) => api.get(`/users/${userId}`).catch(handleApiError);
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData).catch(handleApiError);
export const deleteUser = (userId) => api.delete(`/users/${userId}`).catch(handleApiError);

// Events
export const getEvents = () => api.get('/events').catch(handleApiError);
export const getEvent = (eventId) => api.get(`/events/${eventId}`).catch(handleApiError);
export const createEvent = (eventData) => api.post('/events', eventData).catch(handleApiError);
export const updateEvent = (eventId, eventData) => api.put(`/events/${eventId}`, eventData).catch(handleApiError);
export const deleteEvent = (eventId) => api.delete(`/events/${eventId}`).catch(handleApiError);

// Bookings
export const getBookings = () => api.get('/bookings').catch(handleApiError);
export const getBooking = (bookingId) => api.get(`/bookings/${bookingId}`).catch(handleApiError);
export const createBooking = (bookingData) => api.post('/bookings', bookingData).catch(handleApiError);
export const updateBooking = (bookingId, bookingData) => api.put(`/bookings/${bookingId}`, bookingData).catch(handleApiError);
export const deleteBooking = (bookingId) => api.delete(`/bookings/${bookingId}`).catch(handleApiError);

// Tasks
export const getTasks = () => api.get('/tasks').catch(handleApiError);
export const getTask = (taskId) => api.get(`/tasks/${taskId}`).catch(handleApiError);
export const createTask = (taskData) => api.post('/tasks', taskData).catch(handleApiError);
export const updateTask = (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData).catch(handleApiError);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`).catch(handleApiError);

// User Preferences
export const getUserPreferences = () => api.get('/user_preferences').catch(handleApiError);
export const getUserPreference = (preferenceId) => api.get(`/user_preferences/${preferenceId}`).catch(handleApiError);
export const createUserPreference = (preferenceData) => api.post('/user_preferences', preferenceData).catch(handleApiError);
export const updateUserPreference = (preferenceId, preferenceData) => api.put(`/user_preferences/${preferenceId}`, preferenceData).catch(handleApiError);
export const deleteUserPreference = (preferenceId) => api.delete(`/user_preferences/${preferenceId}`).catch(handleApiError);

// Event Feedback
export const getEventFeedbacks = () => api.get('/event_feedback').catch(handleApiError);
export const getEventFeedback = (feedbackId) => api.get(`/event_feedback/${feedbackId}`).catch(handleApiError);
export const createEventFeedback = (feedbackData) => api.post('/event_feedback', feedbackData).catch(handleApiError);
export const updateEventFeedback = (feedbackId, feedbackData) => api.put(`/event_feedback/${feedbackId}`, feedbackData).catch(handleApiError);
export const deleteEventFeedback = (feedbackId) => api.delete(`/event_feedback/${feedbackId}`).catch(handleApiError);

// Networking Connections
export const getNetworkingConnections = () => api.get('/networking_connections').catch(handleApiError);
export const getNetworkingConnection = (connectionId) => api.get(`/networking_connections/${connectionId}`).catch(handleApiError);
export const createNetworkingConnection = (connectionData) => api.post('/networking_connections', connectionData).catch(handleApiError);
export const updateNetworkingConnection = (connectionId, connectionData) => api.put(`/networking_connections/${connectionId}`, connectionData).catch(handleApiError);
export const deleteNetworkingConnection = (connectionId) => api.delete(`/networking_connections/${connectionId}`).catch(handleApiError);

// Event Photos
export const getEventPhotos = () => api.get('/event_photos').catch(handleApiError);
export const getEventPhoto = (photoId) => api.get(`/event_photos/${photoId}`).catch(handleApiError);
export const createEventPhoto = (photoData) => api.post('/event_photos', photoData).catch(handleApiError);
export const updateEventPhoto = (photoId, photoData) => api.put(`/event_photos/${photoId}`, photoData).catch(handleApiError);
export const deleteEventPhoto = (photoId) => api.delete(`/event_photos/${photoId}`).catch(handleApiError);

// Payments
export const getPayments = () => api.get('/payments').catch(handleApiError);
export const getPayment = (paymentId) => api.get(`/payments/${paymentId}`).catch(handleApiError);
export const createPayment = (paymentData) => api.post('/payments', paymentData).catch(handleApiError);
export const updatePayment = (paymentId, paymentData) => api.put(`/payments/${paymentId}`, paymentData).catch(handleApiError);
export const deletePayment = (paymentId) => api.delete(`/payments/${paymentId}`).catch(handleApiError);

// Notifications
export const getNotifications = () => api.get('/notifications').catch(handleApiError);
export const getNotification = (notificationId) => api.get(`/notifications/${notificationId}`).catch(handleApiError);
export const createNotification = (notificationData) => api.post('/notifications', notificationData).catch(handleApiError);
export const updateNotification = (notificationId, notificationData) => api.put(`/notifications/${notificationId}`, notificationData).catch(handleApiError);
export const deleteNotification = (notificationId) => api.delete(`/notifications/${notificationId}`).catch(handleApiError);

// Sponsors
export const getSponsors = () => api.get('/sponsors').catch(handleApiError);
export const getSponsor = (sponsorId) => api.get(`/sponsors/${sponsorId}`).catch(handleApiError);
export const createSponsor = (sponsorData) => api.post('/sponsors', sponsorData).catch(handleApiError);
export const updateSponsor = (sponsorId, sponsorData) => api.put(`/sponsors/${sponsorId}`, sponsorData).catch(handleApiError);
export const deleteSponsor = (sponsorId) => api.delete(`/sponsors/${sponsorId}`).catch(handleApiError);

// Event Sponsors
export const getEventSponsors = () => api.get('/event_sponsors').catch(handleApiError);
export const getEventSponsor = (eventSponsorId) => api.get(`/event_sponsors/${eventSponsorId}`).catch(handleApiError);
export const createEventSponsor = (eventSponsorData) => api.post('/event_sponsors', eventSponsorData).catch(handleApiError);
export const updateEventSponsor = (eventSponsorId, eventSponsorData) => api.put(`/event_sponsors/${eventSponsorId}`, eventSponsorData).catch(handleApiError);
export const deleteEventSponsor = (eventSponsorId) => api.delete(`/event_sponsors/${eventSponsorId}`).catch(handleApiError);