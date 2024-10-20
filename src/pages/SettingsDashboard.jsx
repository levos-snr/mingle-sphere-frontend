import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Bell, 
  Settings, 
  Edit, 
  Trash, 
  Check,
  X,
  ChevronRight,
  Save
} from 'lucide-react';
import { Tooltip, Modal, Alert, Toast } from 'flowbite-react';  // Import Toast

const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [error, setError] = useState(null);

  // States for handling toasts
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    setEditedUser(user);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications. Please try again later.');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEditProfile = () => {
    setModalContent('profile');
    setShowModal(true);
  };

  const handleEditEvent = () => {
    setModalContent('event');
    setShowModal(true);
  };

  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser.user);
      localStorage.setItem('user', JSON.stringify(updatedUser.user));
      setShowModal(false);
      setError(null);

      // Show success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update profile. Please try again later.');

      // Show error toast
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000); // Hide after 3 seconds
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Profile Settings</h2>
            {currentUser && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <p><strong>Username:</strong> {currentUser.username}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Role:</strong> {currentUser.role}</p>
              </div>
            )}
            <button 
              onClick={handleEditProfile}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
            >
              <Edit size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Event Management</h2>
            <button 
              onClick={handleEditEvent}
              className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
            >
              <Calendar size={18} />
              <span>Edit Events</span>
            </button>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Notifications</h2>
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.map((notif) => (
                  <li key={notif.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                    <span>{notif.message}</span>
                    <div className="flex space-x-2">
                      <Tooltip content="Mark as read">
                        <button className="text-green-500 hover:text-green-600">
                          <Check size={18} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <button 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteNotification(notif.id)}
                        >
                          <Trash size={18} />
                        </button>
                      </Tooltip>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications to display.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-orange-500">Settings Dashboard</h1>

        {/* Error Alert */}
        {error && (
          <Alert color="failure" className="mb-4">
            <span className="font-medium">Error!</span> {error}
          </Alert>
        )}

        {/* Success Toast */}
        {showSuccessToast && (
          <Toast>
            <div className="inline-flex items-center p-4 text-sm text-green-700 bg-green-100 rounded-lg">
              <Check className="mr-2" size={18} />
              <div>Profile updated successfully!</div>
            </div>
          </Toast>
        )}

        {/* Error Toast */}
        {showErrorToast && (
          <Toast>
            <div className="inline-flex items-center p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              <X className="mr-2" size={18} />
              <div>Failed to update profile. Please try again.</div>
            </div>
          </Toast>
        )}

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 pr-4 mb-4 md:mb-0">
            <nav className="space-y-2">
              {['profile', 'events', 'notifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center space-x-2 w-full p-3 rounded-lg transition-colors duration-300 ${
                    activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tab === 'profile' && <User size={18} />}
                  {tab === 'events' && <Calendar size={18} />}
                  {tab === 'notifications' && <Bell size={18} />}
                  <span className="capitalize">{tab}</span>
                  <ChevronRight size={18} className="ml-auto" />
                </button>
              ))}
            </nav>
          </div>
          <div className="w-full md:w-3/4 pl-0 md:pl-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          {modalContent === 'profile' ? 'Edit Profile' : 'Edit Event'}
        </Modal.Header>
        <Modal.Body>
          {modalContent === 'profile' && editedUser && (
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 bg-gray-700 text-white rounded-lg"
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center space-x-2"
            onClick={handleSaveProfile}
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>
          <button 
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
            onClick={() => setShowModal(false)}
          >
            <X size={18} />
            <span>Cancel</span>
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SettingsDashboard;
