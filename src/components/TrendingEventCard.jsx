import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const TrendingEventCard = ({ event }) => (
  <Link to={`/event/${event.id}`} className="flex-shrink-0 w-64 md:w-80 lg:w-96 mr-4">
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      <img
        src={event.cover_photo_url || "https://placehold.co/300x200?text=No+Image"}
        alt={event.title}
        className="w-full h-32 md:h-48 lg:h-56 object-cover"
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

export default TrendingEventCard;
