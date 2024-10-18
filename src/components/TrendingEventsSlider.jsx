import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TrendingUp, Users } from 'lucide-react';

const TrendingEventCard = ({ event }) => (
  <Link to={`/event/${event.id}`} className="flex-shrink-0 w-64 mr-4">
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      <img
        src={event.cover_photo_url || "https://placehold.co/300x200?text=No+Image"}
        alt={event.title}
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-base mb-2 truncate">
          {event.title}
        </h3>
        <div className="flex items-center text-sm text-gray-600">
          <Users size={16} className="text-orange-500 mr-1" />
          <span>{event.capacity} attendees</span>
        </div>
      </div>
    </div>
  </Link>
);

const TrendingEventsSlider = () => {
  const [trendingEvents, setTrendingEvents] = useState([]);

  useEffect(() => {
    const fetchTrendingEvents = async () => {
      try {
        const response = await axios.get("/api/events");
        // Filter events to only include those with a capacity over 1000
        const filteredEvents = response.data.filter(event => event.capacity > 1000);
        setTrendingEvents(filteredEvents);
      } catch (error) {
        console.error("Failed to fetch trending events", error);
      }
    };
    fetchTrendingEvents();
  }, []);

  return (
    <div className="mb-14">
      {/* Slider Header */}
      <div className="flex items-center mb-4">
        <TrendingUp size={28} className="text-orange-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">
          Trending <span className="text-orange-500">Events</span>
        </h2>
      </div>

      {/* Horizontal Scrolling Events */}
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-4">
          {trendingEvents.map((event) => (
            <TrendingEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingEventsSlider;
