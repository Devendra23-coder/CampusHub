import React, { useEffect, useState } from 'react';
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

export default Clubs;