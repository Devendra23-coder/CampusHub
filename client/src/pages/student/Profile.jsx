import React, { useEffect, useState } from 'react';
import { users } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    users.getProfile().then(res => setProfile(res.data.data))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await users.updateProfile(profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={profile?.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" value={profile?.email || ''} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={profile?.phone || ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={profile?.department || ''} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg" value={profile?.year || ''} onChange={(e) => setProfile({ ...profile, year: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
