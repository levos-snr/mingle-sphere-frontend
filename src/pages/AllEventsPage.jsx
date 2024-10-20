import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import EventCard from "../components/EventCard";
import signup from "../assets/signup.jpeg";
import axios from "axios";

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [location.search]);

  const fetchEvents = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const type = searchParams.get('type') || '';
      const eventDate = searchParams.get('date') || '';

      let url = '/api/events';
      const response = await axios.get(url);
      
      let filteredEvents = response.data;

      if (type) {
        filteredEvents = filteredEvents.filter(event => event.category.toLowerCase() === type.toLowerCase());
      }

      if (eventDate) {
        filteredEvents = filteredEvents.filter(event => {
          const eventDateObj = new Date(event.date);
          const searchDateObj = new Date(eventDate);
          return eventDateObj.toDateString() === searchDateObj.toDateString();
        });
      }

      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/events');
      const uniqueCategories = [...new Set(response.data.map(event => event.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEventDelete = async (deletedEventId) => {
    try {
      await axios.delete(`/api/events/${deletedEventId}`);
      setEvents((prevEvents) => prevEvents.filter(event => event.id !== deletedEventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterEvents(category, selectedTimeFrame);
  };

  const handleTimeFrameChange = (timeFrame) => {
    setSelectedTimeFrame(timeFrame);
    filterEvents(selectedCategory, timeFrame);
  };

  const filterEvents = async (category, timeFrame) => {
    try {
      const response = await axios.get('/api/events');
      let filteredEvents = response.data;

      if (category) {
        filteredEvents = filteredEvents.filter(event => event.category.toLowerCase() === category.toLowerCase());
      }

      if (timeFrame) {
        const currentDate = new Date();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const oneMonth = 30 * 24 * 60 * 60 * 1000;

        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.date);
          switch (timeFrame) {
            case 'This Week':
              return eventDate >= currentDate && eventDate <= new Date(currentDate.getTime() + oneWeek);
            case 'Next Week':
              return eventDate >= new Date(currentDate.getTime() + oneWeek) && eventDate <= new Date(currentDate.getTime() + 2 * oneWeek);
            case 'This Month':
              return eventDate >= currentDate && eventDate <= new Date(currentDate.getTime() + oneMonth);
            default:
              return true;
          }
        });
      }

      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error filtering events:", error);
    }
  };

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
          <div className="relative">
            <button 
              className="flex items-center bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
              onClick={() => document.getElementById('categoryDropdown').classList.toggle('hidden')}
            >
              <span className="mr-2">{selectedCategory || "Category"}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <div id="categoryDropdown" className="absolute z-10 hidden bg-white rounded-md shadow-lg mt-2">
              {categories.map((category) => (
                <button 
                  key={category} 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            {["This Week", "Next Week", "This Month"].map((timeFrame) => (
              <button 
                key={timeFrame}
                className={`bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 ${
                  selectedTimeFrame === timeFrame ? 'bg-purple-600 text-white' : ''
                }`}
                onClick={() => handleTimeFrameChange(timeFrame)}
              >
                {timeFrame}
              </button>
            ))}
          </div>
        </div>

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