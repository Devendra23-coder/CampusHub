import React, { useEffect, useState } from 'react';
import { registrations as regApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const MyEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await regApi.getMyRegistrations();
      setRegistrations(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Registered Events</h1>
      {registrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map(reg => (
            <div key={reg.registration_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{reg.title}</h3>
              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(reg.event_date).toLocaleDateString()} {new Date(reg.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {reg.location}</div>
                <div>Status: <span className="font-semibold text-indigo-600">{reg.registration_status}</span></div>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100">
                <Link to={`/events/${reg.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                  View Ticket & Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="You haven't registered for any events yet." actionButton={<Link to="/events" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg">Browse Events</Link>} />
      )}
    </div>
  );
};

export default MyEvents;