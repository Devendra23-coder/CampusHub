import React, { useState } from 'react';
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

export default ClubForm;