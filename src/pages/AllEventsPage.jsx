import React, { useEffect, useState } from "react";
import { Calendar, MapPin, User, ChevronDown, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import signup from "../assets/signup.jpeg";

// Define the EventCard with additional details such as category, capacity, and price
const EventCard = ({ id, cover_photo_url, title, start_datetime, location, category, capacity, price, isPrivate }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
    <img src={cover_photo_url} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <div className="flex items-center text-sm text-gray-600 mb-1">
        <Calendar className="w-4 h-4 mr-2" />
        <span>{start_datetime}</span>
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
        <span>{price ? `$${price}` : "Free"}</span>
      </div>
      <div className="text-sm text-gray-600 mb-1">
        <span>Category: {category}</span>
      </div>
      <div className="text-sm text-gray-600 mb-4">
        <span>Private Event: {isPrivate ? "Yes" : "No"}</span>
      </div>

      {/* Add Link to Single Event Page */}
      <Link
        to={`/event/${id}`}
        className="mt-4 inline-block text-purple-600 hover:text-purple-800 transition-colors duration-200"
      >
        View Details
      </Link>
    </div>
  </div>
);

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from the API
  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white py-10 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl font-bold mb-4 animate-fade-in">
                Event<span className="text-purple-600">Mingle</span>-ing
                <br />
                the Best.<span className="text-purple-600">Day</span>.
                <br />
                Ever.
              </h1>
              <div className="flex space-x-4 mb-4">
                <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
                  <span className="font-bold text-2xl">2k+</span>
                  <br />
                  <span className="text-sm">Events</span>
                </div>
                <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
                  <span className="font-bold text-2xl">100+</span>
                  <br />
                  <span className="text-sm">Venues</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <img
                src={signup}
                alt="Event"
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-4 animate-fade-in-up">Events around you</h2>
        <div className="flex justify-between items-center mb-6">
          <button className="flex items-center bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
            <span className="mr-2">Category</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="flex space-x-2">
            <button className="bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
              This Week
            </button>
            <button className="bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
              Next Week
            </button>
            <button className="bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
              This Month
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllEventsPage;
