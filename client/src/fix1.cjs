const fs = require('fs');

const eventCard = `import React from 'react';
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
          to={\`/events/\${event.id}\`}
          className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;`;

const eventForm = `import React, { useState } from 'react';
import { events as eventsApi } from '../../services/api';
import toast from 'react-hot-toast';

const EventForm = ({ event, onSave }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
    end_date: event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
    location: event?.location || '',
    category: event?.category || '',
    max_participants: event?.max_participants || '',
    image_url: event?.image_url || '',
    status: event?.status || 'upcoming'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (event) {
        await eventsApi.updateEvent(event.id, formData);
        toast.success('Event updated');
      } else {
        await eventsApi.createEvent(formData);
        toast.success('Event created');
      }
      onSave();
    } catch (error) {
      toast.error('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-700">Title</label><input required type="text" name="title" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.title} onChange={handleChange} /></div>
      <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea required name="description" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" value={formData.description} onChange={handleChange}></textarea></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700">Start Date</label><input required type="datetime-local" name="event_date" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.event_date} onChange={handleChange} /></div>
        <div><label className="block text-sm font-medium text-gray-700">End Date</label><input type="datetime-local" name="end_date" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.end_date} onChange={handleChange} /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700">Location</label><input required type="text" name="location" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.location} onChange={handleChange} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700">Category</label><input required type="text" name="category" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.category} onChange={handleChange} /></div>
        <div><label className="block text-sm font-medium text-gray-700">Max Participants</label><input type="number" name="max_participants" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.max_participants} onChange={handleChange} /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700">Image URL</label><input type="text" name="image_url" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.image_url} onChange={handleChange} /></div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select name="status" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.status} onChange={handleChange}>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white rounded-lg py-2 mt-4 hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save Event'}</button>
    </form>
  );
};

export default EventForm;`;

const clubCard = `import React from 'react';
import { Mail, Users } from 'lucide-react';

const ClubCard = ({ club }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition">
      {club.image_url && <img src={club.image_url} alt={club.name} className="w-full h-32 object-cover" />}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{club.name}</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">{club.category}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{club.description}</p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> <a href={\`mailto:\${club.contact_email}\`} className="text-indigo-600 hover:underline">{club.contact_email}</a></div>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;`;

const clubForm = `import React, { useState } from 'react';
import { clubs as clubsApi } from '../../services/api';
import toast from 'react-hot-toast';

const ClubForm = ({ club, onSave }) => {
  const [formData, setFormData] = useState({
    name: club?.name || '',
    description: club?.description || '',
    category: club?.category || '',
    image_url: club?.image_url || '',
    contact_email: club?.contact_email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (club) {
        await clubsApi.updateClub(club.id, formData);
        toast.success('Club updated');
      } else {
        await clubsApi.createClub(formData);
        toast.success('Club created');
      }
      onSave();
    } catch (error) {
      toast.error('Failed to save club');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-700">Name</label><input required type="text" name="name" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.name} onChange={handleChange} /></div>
      <div><label className="block text-sm font-medium text-gray-700">Description</label><textarea required name="description" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" rows="3" value={formData.description} onChange={handleChange}></textarea></div>
      <div><label className="block text-sm font-medium text-gray-700">Category</label><input required type="text" name="category" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.category} onChange={handleChange} /></div>
      <div><label className="block text-sm font-medium text-gray-700">Contact Email</label><input required type="email" name="contact_email" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.contact_email} onChange={handleChange} /></div>
      <div><label className="block text-sm font-medium text-gray-700">Image URL</label><input type="text" name="image_url" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.image_url} onChange={handleChange} /></div>
      <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white rounded-lg py-2 mt-4 hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save Club'}</button>
    </form>
  );
};

export default ClubForm;`;

const annCard = `import React from 'react';
import { Bell, AlertCircle, Info } from 'lucide-react';

const AnnouncementCard = ({ announcement }) => {
  const getIcon = () => {
    switch (announcement.priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Bell className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col h-full">
      <div className="flex items-start mb-3">
        <div className="mr-3 mt-1">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
          <span className="text-xs text-gray-500">{new Date(announcement.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700 flex-1 whitespace-pre-wrap">{announcement.content}</p>
    </div>
  );
};

export default AnnouncementCard;`;

const annForm = `import React, { useState } from 'react';
import { announcements as announcementsApi } from '../../services/api';
import toast from 'react-hot-toast';

const AnnouncementForm = ({ announcement, onSave }) => {
  const [formData, setFormData] = useState({
    title: announcement?.title || '',
    content: announcement?.content || '',
    priority: announcement?.priority || 'low'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (announcement) {
        await announcementsApi.updateAnnouncement(announcement.id, formData);
        toast.success('Announcement updated');
      } else {
        await announcementsApi.createAnnouncement(formData);
        toast.success('Announcement created');
      }
      onSave();
    } catch (error) {
      toast.error('Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-700">Title</label><input required type="text" name="title" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.title} onChange={handleChange} /></div>
      <div><label className="block text-sm font-medium text-gray-700">Content</label><textarea required name="content" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" rows="4" value={formData.content} onChange={handleChange}></textarea></div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select name="priority" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white rounded-lg py-2 mt-4 hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save Announcement'}</button>
    </form>
  );
};

export default AnnouncementForm;`;

fs.writeFileSync('components/events/EventCard.jsx', eventCard);
fs.writeFileSync('components/events/EventForm.jsx', eventForm);
fs.writeFileSync('components/clubs/ClubCard.jsx', clubCard);
fs.writeFileSync('components/clubs/ClubForm.jsx', clubForm);
fs.writeFileSync('components/announcements/AnnouncementCard.jsx', annCard);
fs.writeFileSync('components/announcements/AnnouncementForm.jsx', annForm);

console.log("Written components");
