import React, { useState } from 'react';
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

export default EventForm;