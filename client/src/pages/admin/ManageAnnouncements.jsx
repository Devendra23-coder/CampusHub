import React, { useState, useEffect } from 'react';
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

export default ManageAnnouncements;