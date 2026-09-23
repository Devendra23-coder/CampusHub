import React, { useEffect, useState } from 'react';
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

export default Announcements;