import React from "react";
import { Search } from "lucide-react";
import banner from "../assets/event0.jpeg";

const EventHeroBanner = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full max-w-5xl mx-auto rounded-2xl  shadow-2xl">
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
                <select className="w-full p-3 rounded bg-white text-black focus:ring-2 focus:ring-orange-500 transition-colors">
                  <option>Choose event type</option>
                </select>
              </div>

              {/* Location */}
              <div className="flex-1">
                <span className="block text-sm mb-1 text-gray-400">Location</span>
                <select className="w-full p-3 rounded bg-white text-black focus:ring-2 focus:ring-orange-500 transition-colors">
                  <option>Choose location</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="flex-1">
                <span className="block text-sm mb-1 text-gray-400">When</span>
                <select className="w-full p-3 rounded bg-white text-black focus:ring-2 focus:ring-orange-500 transition-colors">
                  <option>Choose date and time</option>
                </select>
              </div>

              {/* Search Button */}
              <button className="bg-orange-500 text-white p-3 rounded-lg flex items-center justify-center self-end md:self-center hover:bg-orange-600 transition-transform transform hover:scale-110">
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
