import React, { useEffect, useState } from 'react';
import { users, events, clubs, announcements } from '../../services/api';
import { Users, Calendar, Users2, Bell } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, events: 0, clubs: 0, announcements: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      users.getUsers(),
      events.getEvents(),
      clubs.getClubs(),
      announcements.getAnnouncements()
    ]).then(([u, e, c, a]) => {
      setStats({
        users: u.data.data.length,
        events: e.data.data.length,
        clubs: c.data.data.length,
        announcements: a.data.data.length
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-500' },
    { title: 'Events', value: stats.events, icon: Calendar, color: 'bg-green-500' },
    { title: 'Clubs', value: stats.clubs, icon: Users2, color: 'bg-purple-500' },
    { title: 'Announcements', value: stats.announcements, icon: Bell, color: 'bg-yellow-500' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <div className={`p-4 rounded-full ${stat.color} text-white mr-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
