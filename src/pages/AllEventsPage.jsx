import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import signup from "../assets/signup.jpeg";

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);

  // Fetch events from the API
  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  // Function to handle event deletion
  const handleEventDelete = (deletedEventId) => {
    setEvents((prevEvents) => prevEvents.filter(event => event.id !== deletedEventId));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
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

      {/* Events Section */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-4 animate-fade-in-up">Events around you</h2>

        {/* Filters Section */}
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} {...event} onDelete={handleEventDelete} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllEventsPage;
