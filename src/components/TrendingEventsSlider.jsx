import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';
import TrendingEventCard from './TrendingEventCard';

const TrendingEventsSlider = () => {
  const [trendingEvents, setTrendingEvents] = useState([]);

  useEffect(() => {
    const fetchTrendingEvents = async () => {
      try {
        const response = await axios.get("/api/events");
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
      <div className="overflow-x-auto">
        <div className="flex space-x-4">
          {trendingEvents.map((event) => (
            <TrendingEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingEventsSlider;
