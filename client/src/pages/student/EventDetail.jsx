import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { events as eventsApi, registrations as regApi } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Calendar, MapPin, Users, Download } from 'lucide-react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { generateTicketPDF } from '../../utils/generateTicketPDF';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const [eventRes, regsRes] = await Promise.all([
        eventsApi.getEvent(id),
        regApi.getMyRegistrations()
      ]);
      setEvent(eventRes.data.data);
      
      const userReg = regsRes.data.data.find(reg => String(reg.id) === id && reg.registration_status === 'registered');
      setRegistration(userReg || null);
    } catch (error) {
      toast.error('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  // Build QR data string for the ticket
  const getQRData = (reg) => {
    return [
      'CampusHub',
      `Ticket ID: ${reg.ticket_id || 'N/A'}`,
      `Registration ID: ${reg.registration_id}`,
      `Event ID: ${reg.id || id}`
    ].join('\n');
  };

  // Build ticket data object for PDF generation
  const buildTicketData = (reg) => ({
    id: reg.registration_id,
    ticket_id: reg.ticket_id,
    event_id: Number(id),
    user_id: user.id,
    status: reg.registration_status,
    registered_at: reg.registered_at,
    event_title: reg.title || event?.title,
    event_description: reg.description || event?.description,
    event_date: reg.event_date || event?.event_date,
    end_date: reg.end_date || event?.end_date,
    event_location: reg.location || event?.location,
    event_category: reg.category || event?.category,
    student_name: user.name,
    student_email: user.email,
    student_department: user.department,
    student_year: user.year
  });

  const handleDownloadTicket = () => {
    if (!registration) return;
    // Wait a tick for QR canvas to render, then grab it
    setTimeout(() => {
      const canvas = qrRef.current?.querySelector('canvas');
      if (!canvas) {
        toast.error('QR code not ready. Please try again.');
        return;
      }
      try {
        generateTicketPDF(buildTicketData(registration), canvas);
        toast.success('Ticket PDF downloaded!');
      } catch (err) {
        console.error('PDF generation error:', err);
        toast.error('Failed to generate ticket PDF');
      }
    }, 100);
  };

  const handleRegister = async () => {
    setProcessing(true);
    try {
      const res = await regApi.registerForEvent({ event_id: id });
      toast.success('Successfully registered!');
      // Re-fetch to get full joined data including ticket_id
      await fetchEventDetails();
      // Auto-download ticket after a short delay for QR to render
      setTimeout(() => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
          try {
            const regData = res.data.data;
            generateTicketPDF({
              ...regData,
              student_name: regData.student_name || user.name,
              student_email: regData.student_email || user.email,
              student_department: regData.student_department || user.department,
              student_year: regData.student_year || user.year
            }, canvas);
          } catch (e) {
            console.error('Auto-download PDF error:', e);
          }
        }
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return;
    setProcessing(true);
    try {
      await regApi.cancelRegistration(registration.registration_id);
      setRegistration(null);
      toast.success('Registration cancelled');
      fetchEventDetails();
    } catch (error) {
      toast.error('Failed to cancel registration');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return null;

  const eventTime = new Date(event.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {event.image_url && (
        <img src={event.image_url} alt={event.title} className="w-full h-64 object-cover" />
      )}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
            {event.category}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-600">
          <div className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-indigo-600" /> {new Date(event.event_date).toLocaleDateString()} at {eventTime}</div>
          <div className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-indigo-600" /> {event.location}</div>
          <div className="flex items-center"><Users className="w-5 h-5 mr-3 text-indigo-600" /> Max Participants: {event.max_participants || 'Unlimited'}</div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">About this event</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          {registration ? (
            <div className="flex flex-col items-center gap-6">
              {/* Ticket ID Badge */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-6 py-3 text-center">
                <p className="text-xs text-indigo-500 font-medium">TICKET ID</p>
                <p className="text-lg font-bold text-indigo-700">{registration.ticket_id || `CH-REG-${registration.registration_id}`}</p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold mb-2 text-gray-700">Your Entry Ticket</p>
                <QRCodeSVG value={getQRData(registration)} size={128} />
              </div>

              {/* Hidden QR Canvas for PDF generation */}
              <div ref={qrRef} style={{ position: 'absolute', left: '-9999px' }}>
                <QRCodeCanvas value={getQRData(registration)} size={256} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleDownloadTicket}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Ticket PDF
                </button>
                <button
                  onClick={handleCancel}
                  disabled={processing}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Cancel Registration'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={processing}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 w-full md:w-auto"
            >
              {processing ? 'Processing...' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;