import React from 'react';
import { Bell, AlertCircle, Info } from 'lucide-react';

const AnnouncementCard = ({ announcement }) => {
  const getIcon = () => {
    switch (announcement.priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Bell className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col h-full">
      <div className="flex items-start mb-3">
        <div className="mr-3 mt-1">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
          <span className="text-xs text-gray-500">{new Date(announcement.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700 flex-1 whitespace-pre-wrap">{announcement.content}</p>
    </div>
  );
};

export default AnnouncementCard;