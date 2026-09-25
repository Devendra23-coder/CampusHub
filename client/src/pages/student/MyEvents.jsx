import React, { useEffect, useState, useRef } from 'react';
import { registrations as regApi } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Download, Ticket } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { generateTicketPDF } from '../../utils/generateTicketPDF';

const MyEvents = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const qrRefs = useRef({});

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await regApi.getMyRegistrations();
      setRegistrations(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const getQRData = (reg) => {
    return [
      'CampusHub',
      `Ticket ID: ${reg.ticket_id || 'N/A'}`,
      `Registration ID: ${reg.registration_id}`,
      `Event ID: ${reg.id}`
    ].join('\n');
  };

  const handleDownloadTicket = (reg) => {
    setDownloadingId(reg.registration_id);
    setTimeout(() => {
      const container = qrRefs.current[reg.registration_id];
      const canvas = container?.querySelector('canvas');
      if (!canvas) {
        toast.error('QR code not ready. Please try again.');
        setDownloadingId(null);
        return;
      }
      try {
        generateTicketPDF({
          id: reg.registration_id,
          ticket_id: reg.ticket_id,
          event_id: reg.id,
          user_id: user.id,
          status: reg.registration_status,
          registered_at: reg.registered_at,
          event_title: reg.title,
          event_description: reg.description,
          event_date: reg.event_date,
          end_date: reg.end_date,
          event_location: reg.location,
          event_category: reg.category,
          student_name: user.name,
          student_email: user.email,
          student_department: user.department,
          student_year: user.year
        }, canvas);
        toast.success('Ticket downloaded!');
      } catch (err) {
        console.error('PDF error:', err);
        toast.error('Failed to generate ticket');
      } finally {
        setDownloadingId(null);
      }
    }, 150);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Registered Events</h1>
      {registrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map(reg => (
            <div key={reg.registration_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{reg.title}</h3>
              
              {/* Ticket ID */}
              {reg.ticket_id && (
                <div className="flex items-center mb-3 text-sm">
                  <Ticket className="w-4 h-4 mr-2 text-indigo-600" />
                  <span className="font-mono font-semibold text-indigo-700">{reg.ticket_id}</span>
                </div>
              )}

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(reg.event_date).toLocaleDateString()} {new Date(reg.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {reg.location}</div>
                <div>Status: <span className={`font-semibold ${reg.registration_status === 'registered' ? 'text-green-600' : 'text-red-500'}`}>{reg.registration_status}</span></div>
              </div>

              {/* Hidden QR Canvas for PDF */}
              <div ref={el => qrRefs.current[reg.registration_id] = el} style={{ position: 'absolute', left: '-9999px' }}>
                <QRCodeCanvas value={getQRData(reg)} size={256} />
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                {reg.registration_status === 'registered' && (
                  <button
                    onClick={() => handleDownloadTicket(reg)}
                    disabled={downloadingId === reg.registration_id}
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {downloadingId === reg.registration_id ? 'Generating...' : 'Download Ticket'}
                  </button>
                )}
                <Link to={`/events/${reg.id}`} className="text-center px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition text-sm font-medium">
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="You haven't registered for any events yet." actionButton={<Link to="/events" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg">Browse Events</Link>} />
      )}
    </div>
  );
};

export default MyEvents;