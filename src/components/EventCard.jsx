import { useEffect, useState } from "react";
import { Calendar, MapPin, User, DollarSign, Edit, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; 

const EventCard = ({ id, cover_photo_url, title, start_datetime, location, category, capacity, price, isPrivate, onDelete }) => {
  const [user, setUser] = useState(null);

  // user from local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  //  if user is an admin
  const isAdmin = user?.role === 'admin'; 

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await axios.delete(`/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
        
        if (response.status === 200) {
          alert("Event deleted successfully");
          onDelete(id);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete the event. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
        <img src={cover_photo_url || "https://placehold.co/600x400"} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>

        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(start_datetime).toLocaleString()}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-1">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{location}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-1">
          <User className="w-4 h-4 mr-2" />
          <span>Capacity: {capacity}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-1">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>{price ? `Ksh ${price}` : "Free"}</span>
        </div>

        <div className="text-sm text-gray-600 mb-1">
          <span>Category: {category}</span>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          <span>Private Event: {isPrivate ? "Yes" : "No"}</span>
        </div>

        <Link to={`/event/${id}`} className="mt-4 inline-block text-purple-600 hover:text-purple-800 transition-colors duration-200">
          View Details
        </Link>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex space-x-2 mt-4">
            <Link
              to={`/edit-event/${id}`}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <Edit className="inline-block w-5 h-5 mr-1" />
              Edit
            </Link>
            <button
              onClick={() => handleDelete(id)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              <Trash className="inline-block w-5 h-5 mr-1" />
              Delete
            </button>
          </div>
        )}
        </div>
    </div>
  );
};

export default EventCard;
