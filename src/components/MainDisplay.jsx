import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Calendar, DollarSign } from "lucide-react";
import TrendingEventsSlider from "./TrendingEventsSlider";

const EventCard = ({ event }) => (
  <Link to={`/event/${event.id}`} className="block">
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      <img
        src={event.cover_photo_url || "https://placehold.co/300x200?text=No+Image"}
        alt={event.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <Calendar className="w-4 h-4 text-orange-500" />
          {new Date(event.start_datetime).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          {event.category || "Unknown Category"} •{" "}
          {event.price ? (
            <>
              <DollarSign className="w-4 h-4 text-orange-500" /> ${event.price}
            </>
          ) : (
            "Free"
          )}
        </p>
      </div>
    </div>
  </Link>
);

const MainDisplay = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("Any category");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = {};
        if (category !== "Any category") {
          params.category = category;
        }
        const response = await axios.get("/api/events", { params });
        setEvents(response.data);
      } catch (error) {
        setError("Failed to fetch events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [category]);

  if (loading) {
    return <div className="text-center text-orange-500">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      {/* Trending Events Slider */}
      <TrendingEventsSlider />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Upcoming <span className="text-orange-500">Events</span>
        </h2>

        <div className="flex space-x-2">
          {/* Filters */}
          <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500">
            <option>Weekend</option>
          </select>
          <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500">
            <option>Event type</option>
          </select>
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Any category</option>
            <option>Online Event</option>
            <option>Physical Event</option>
          </select>
        </div>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.slice(0, 7).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <Link to="/allEvent">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-transform transform hover:scale-105">
            Load more...
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MainDisplay;
