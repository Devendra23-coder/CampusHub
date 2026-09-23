import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition">
      {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{event.title}</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">{event.category}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <div className="mt-auto space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(event.event_date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <Link
          to={`/events/${event.id}`}
          className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;