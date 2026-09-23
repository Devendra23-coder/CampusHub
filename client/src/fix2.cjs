const fs = require('fs');

const dashboard = `import React, { useEffect, useState } from 'react';
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

export default Dashboard;`;

const eventsList = `import React, { useEffect, useState } from 'react';
import { events as eventsApi } from '../../services/api';
import EventCard from '../../components/events/EventCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Search } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await eventsApi.getEvents();
      setEvents(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || ev.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(events.map(e => e.category))];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(ev => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      ) : (
        <EmptyState message="No events found matching your criteria." />
      )}
    </div>
  );
};

export default Events;`;

const eventDetail = `import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { events as eventsApi, registrations as regApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Calendar, MapPin, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const [eventRes, regsRes] = await Promise.all([
        eventsApi.getEventById(id),
        regApi.getMyRegistrations()
      ]);
      setEvent(eventRes.data.data);
      
      const userReg = regsRes.data.data.find(reg => String(reg.id) === id);
      setRegistration(userReg || null);
    } catch (error) {
      toast.error('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setProcessing(true);
    try {
      const res = await regApi.registerForEvent(id);
      setRegistration(res.data.data);
      toast.success('Successfully registered!');
      fetchEventDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return;
    setProcessing(true);
    try {
      await regApi.cancelRegistration(registration.registration_id);
      setRegistration(null);
      toast.success('Registration cancelled');
      fetchEventDetails();
    } catch (error) {
      toast.error('Failed to cancel registration');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return null;

  const eventTime = new Date(event.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {event.image_url && (
        <img src={event.image_url} alt={event.title} className="w-full h-64 object-cover" />
      )}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
            {event.category}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-600">
          <div className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-indigo-600" /> {new Date(event.event_date).toLocaleDateString()} at {eventTime}</div>
          <div className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-indigo-600" /> {event.location}</div>
          <div className="flex items-center"><Users className="w-5 h-5 mr-3 text-indigo-600" /> Max Participants: {event.max_participants || 'Unlimited'}</div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">About this event</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
          {registration ? (
            <>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold mb-2 text-gray-700">Your Entry Ticket</p>
                <QRCodeSVG value={JSON.stringify({ eventId: event.id, userId: user.id, registrationId: registration.registration_id })} size={128} />
              </div>
              <button
                onClick={handleCancel}
                disabled={processing}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Cancel Registration'}
              </button>
            </>
          ) : (
            <button
              onClick={handleRegister}
              disabled={processing}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 w-full md:w-auto"
            >
              {processing ? 'Processing...' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;`;

const myEvents = `import React, { useEffect, useState } from 'react';
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
                <Link to={\`/events/\${reg.id}\`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
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

export default MyEvents;`;

const clubs = `import React, { useEffect, useState } from 'react';
import { clubs as clubsApi } from '../../services/api';
import ClubCard from '../../components/clubs/ClubCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clubsApi.getClubs().then(res => {
      setClubs(res.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Campus Clubs</h1>
      {clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map(club => <ClubCard key={club.id} club={club} />)}
        </div>
      ) : (
        <EmptyState message="No clubs available at the moment." />
      )}
    </div>
  );
};

export default Clubs;`;

const announcements = `import React, { useEffect, useState } from 'react';
import { announcements as announcementsApi } from '../../services/api';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementsApi.getAnnouncements().then(res => {
      setAnnouncements(res.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map(ann => <AnnouncementCard key={ann.id} announcement={ann} />)}
        </div>
      ) : (
        <EmptyState message="No announcements found." />
      )}
    </div>
  );
};

export default Announcements;`;

fs.writeFileSync('pages/student/Dashboard.jsx', dashboard);
fs.writeFileSync('pages/student/Events.jsx', eventsList);
fs.writeFileSync('pages/student/EventDetail.jsx', eventDetail);
fs.writeFileSync('pages/student/MyEvents.jsx', myEvents);
fs.writeFileSync('pages/student/Clubs.jsx', clubs);
fs.writeFileSync('pages/student/Announcements.jsx', announcements);
console.log("Written second batch");
