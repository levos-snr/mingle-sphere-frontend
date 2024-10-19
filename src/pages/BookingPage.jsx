import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toast } from 'flowbite-react';
import { HiCheck, HiX } from 'react-icons/hi';
import { Calendar, MapPin } from 'lucide-react';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [bookingDetails, setBookingDetails] = useState({
    user_id: 1, // Replace with actual user ID from authentication
    event_id: parseInt(id),
    status: 'pending',
    dietary_preferences: '',
    networking_interests: '',
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        setError("Failed to fetch event details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/bookings', bookingDetails);
      setToastMessage('Booking submitted successfully!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        navigate(`/event/${id}`);
      }, 2000);
    } catch (error) {
      setToastMessage(error.response?.data?.message || 'Failed to submit booking. Please try again.');
      setToastType('error');
      setShowToast(true);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-400"></div>
  </div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!event) return <div className="text-center">Event not found.</div>;

  return (
    <div className=" min-h-screen text-white">
      <header className=" py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-orange-400">Book Event: {event.title}</h1>
          <div className="flex items-center mb-2 text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{new Date(event.start_datetime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center mb-4 text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-2">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-900 rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="dietary_preferences" className="block mb-2 font-medium text-gray-300">Preferences</label>
            <input
              type="text"
              id="dietary_preferences"
              name="dietary_preferences"
              value={bookingDetails.dietary_preferences}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-800 text-white"
              placeholder="e.g., Vegetarian, Gluten-free"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="networking_interests" className="block mb-2 font-medium text-gray-300">Networking Interests</label>
            <textarea
              id="networking_interests"
              name="networking_interests"
              value={bookingDetails.networking_interests}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-800 text-white"
              rows="3"
              placeholder="e.g., AI, Blockchain, Startups"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105">
            Confirm Booking
          </button>
        </form>

        {showToast && (
          <div className="fixed top-5 right-5 z-50">
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                {toastType === 'success' ? (
                  <HiCheck className="h-5 w-5" />
                ) : (
                  <HiX className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3 text-sm font-normal">
                {toastMessage}
              </div>
              <Toast.Toggle onDismiss={() => setShowToast(false)} />
            </Toast>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingPage;
