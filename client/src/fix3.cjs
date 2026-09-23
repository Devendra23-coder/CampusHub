const fs = require('fs');

const manageEvents = `import React, { useState, useEffect } from 'react';
import { events as eventsApi } from '../../services/api';
import Modal from '../../components/common/Modal';
import EventForm from '../../components/events/EventForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await eventsApi.getEvents();
      setEvents(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventsApi.deleteEvent(id);
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchEvents();
  };

  const openModal = (event = null) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
        <button onClick={() => openModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((ev) => (
              <tr key={ev.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ev.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ev.event_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {ev.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={\`/admin/events/\${ev.id}/registrations\`} className="text-gray-600 hover:text-indigo-600 mr-4 inline-flex items-center"><Users className="w-4 h-4 mr-1"/> Regs</Link>
                  <button onClick={() => openModal(ev)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(ev.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentEvent ? 'Edit Event' : 'Create Event'}>
        <EventForm event={currentEvent} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default ManageEvents;`;

const eventRegs = `import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { events as eventsApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EventRegistrations = () => {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [evRes, regsRes] = await Promise.all([
        eventsApi.getEventById(id),
        eventsApi.getEventRegistrations(id)
      ]);
      setEvent(evRes.data.data);
      setRegistrations(regsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (regId, status) => {
    try {
      await eventsApi.markAttendance(Number(id), { userId: regId, status });
      toast.success('Attendance marked');
      fetchData();
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/events" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Registrations: {event?.title}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Attendance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.map((reg) => (
              <tr key={reg.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reg.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleAttendance(reg.user_id, 'present')} className="text-green-600 hover:text-green-900 mr-3" title="Mark Present"><CheckCircle className="w-5 h-5 inline" /></button>
                  <button onClick={() => handleAttendance(reg.user_id, 'absent')} className="text-red-600 hover:text-red-900" title="Mark Absent"><XCircle className="w-5 h-5 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registrations.length === 0 && <div className="p-6 text-center text-gray-500">No registrations found.</div>}
      </div>
    </div>
  );
};

export default EventRegistrations;`;

const manageClubs = `import React, { useState, useEffect } from 'react';
import { clubs as clubsApi } from '../../services/api';
import Modal from '../../components/common/Modal';
import ClubForm from '../../components/clubs/ClubForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClub, setCurrentClub] = useState(null);

  const fetchClubs = async () => {
    try {
      const res = await clubsApi.getClubs();
      setClubs(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this club?')) return;
    try {
      await clubsApi.deleteClub(id);
      toast.success('Club deleted');
      fetchClubs();
    } catch (error) {
      toast.error('Failed to delete club');
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchClubs();
  };

  const openModal = (club = null) => {
    setCurrentClub(club);
    setIsModalOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Clubs</h1>
        <button onClick={() => openModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Add Club
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Email</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clubs.map((club) => (
              <tr key={club.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{club.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club.contact_email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(club)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(club.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentClub ? 'Edit Club' : 'Create Club'}>
        <ClubForm club={currentClub} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default ManageClubs;`;

const manageAnn = `import React, { useState, useEffect } from 'react';
import { announcements as announcementsApi } from '../../services/api';
import Modal from '../../components/common/Modal';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnn, setCurrentAnn] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const res = await announcementsApi.getAnnouncements();
      setAnnouncements(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await announcementsApi.deleteAnnouncement(id);
      toast.success('Announcement deleted');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchAnnouncements();
  };

  const openModal = (ann = null) => {
    setCurrentAnn(ann);
    setIsModalOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Announcements</h1>
        <button onClick={() => openModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Add Announcement
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {announcements.map((ann) => (
              <tr key={ann.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ann.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ann.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ann.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(ann)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(ann.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentAnn ? 'Edit Announcement' : 'Create Announcement'}>
        <AnnouncementForm announcement={currentAnn} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default ManageAnnouncements;`;

const manageUsers = `import React, { useState, useEffect } from 'react';
import { users as usersApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await usersApi.getUsers();
      setUsersList(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await usersApi.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersList.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user.role !== 'admin' && (
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;`;

fs.writeFileSync('pages/admin/ManageEvents.jsx', manageEvents);
fs.writeFileSync('pages/admin/EventRegistrations.jsx', eventRegs);
fs.writeFileSync('pages/admin/ManageClubs.jsx', manageClubs);
fs.writeFileSync('pages/admin/ManageAnnouncements.jsx', manageAnn);
fs.writeFileSync('pages/admin/ManageUsers.jsx', manageUsers);
console.log("Written third batch");
