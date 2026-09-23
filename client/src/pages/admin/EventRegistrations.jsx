import React, { useState, useEffect } from 'react';
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

export default EventRegistrations;