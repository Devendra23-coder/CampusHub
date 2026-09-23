import React, { useState } from 'react';
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

export default AnnouncementForm;