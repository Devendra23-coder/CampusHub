import React, { useState, useEffect } from 'react';
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

export default ManageClubs;