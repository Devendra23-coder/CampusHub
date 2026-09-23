import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { events as eventsApi, registrations as regApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Calendar, MapPin, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const [eventRes, regsRes] = await Promise.all([
        eventsApi.getEventById(id),
        regApi.getMyRegistrations()
      ]);
      setEvent(eventRes.data.data);
      
      const userReg = regsRes.data.data.find(reg => String(reg.id) === id);
      setRegistration(userReg || null);
    } catch (error) {
      toast.error('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setProcessing(true);
    try {
      const res = await regApi.registerForEvent(id);
      setRegistration(res.data.data);
      toast.success('Successfully registered!');
      fetchEventDetails();
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

        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
          {registration ? (
            <>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold mb-2 text-gray-700">Your Entry Ticket</p>
                <QRCodeSVG value={JSON.stringify({ eventId: event.id, userId: user.id, registrationId: registration.registration_id })} size={128} />
              </div>
              <button
                onClick={handleCancel}
                disabled={processing}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Cancel Registration'}
              </button>
            </>
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