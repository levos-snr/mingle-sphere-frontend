import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventHeroBanner = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const response = await axios.get("/api/events");
      const categories = [...new Set(response.data.map((event) => event.category))];
      setEventTypes(categories);
    } catch (error) {
      console.error("Error fetching event types:", error);
    }
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (selectedType) queryParams.append("type", selectedType);
    if (selectedDate) queryParams.append("date", selectedDate);
    navigate(`/allEvent?${queryParams.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full max-w-5xl mx-auto rounded-2xl shadow-2xl">
        <img
          src="https://pinkcaviar.com.au/wp-content/uploads/2022/09/Professional-and-Stress-Free-Event-Management-Banner-1-1024x571.jpg.webp"
          alt="Event crowd"
          className="w-full h-[400px] object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex flex-col justify-center items-center text-white animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center text-orange-500">
            MADE FOR THOSE
            <br />
            WHO DO
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="bg-gray-800 p-6 rounded-lg flex flex-col md:flex-row gap-4 shadow-lg animate-slideUp">
              {/* Event Type */}
              <div className="flex-1">
                <span className="block text-sm mb-1 text-gray-400">
                  Looking for
                </span>
                <select
                  className="w-full p-3 rounded bg-white text-black focus:ring-2 focus:ring-orange-500 transition-colors"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Choose event type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {/* Date & Time */}
              <div className="flex-1">
                <span className="block text-sm mb-1 text-gray-400">When</span>
                <input
                  type="date"
                  className="w-full p-3 rounded bg-white text-black focus:ring-2 focus:ring-orange-500 transition-colors"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              {/* Search Button */}
              <button
                className="bg-orange-500 text-white p-3 rounded-lg flex items-center justify-center self-end md:self-center hover:bg-orange-600 transition-transform transform hover:scale-110"
                onClick={handleSearch}
              >
                <Search size={24} className="mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeroBanner;
