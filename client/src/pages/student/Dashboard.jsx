import React, { useEffect, useState } from 'react';
import { events, registrations, announcements } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import { Calendar, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState({ events: [], myRegs: [], announcements: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [eventsRes, regsRes, announcementsRes] = await Promise.all([
          events.getEvents(),
          registrations.getMyRegistrations(),
          announcements.getAnnouncements()
        ]);
        setData({
          events: eventsRes.data.data.slice(0, 5),
          myRegs: regsRes.data.data,
          announcements: announcementsRes.data.data.slice(0, 3)
        });
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" /> My Registrations
            </h2>
            <Link to="/my-events" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          {data.myRegs.length > 0 ? (
            <ul className="space-y-3">
              {data.myRegs.slice(0, 4).map(reg => (
                <li key={reg.id} className="text-sm text-gray-700 p-2 bg-gray-50 rounded-lg">
                  <span className="font-medium">{reg.title}</span> - {new Date(reg.event_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No recent registrations.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Inbox className="w-5 h-5 mr-2 text-indigo-600" /> Upcoming Events
            </h2>
            <Link to="/events" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          {data.events.length > 0 ? (
            <ul className="space-y-3">
              {data.events.map(ev => (
                <li key={ev.id} className="text-sm text-gray-700 p-2 bg-gray-50 rounded-lg">
                  <span className="font-medium">{ev.title}</span> - {new Date(ev.event_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No upcoming events.</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Latest Announcements</h2>
          <Link to="/announcements" className="text-sm text-indigo-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.announcements.map(ann => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;