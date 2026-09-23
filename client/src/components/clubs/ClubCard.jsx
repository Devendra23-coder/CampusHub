import React from 'react';
import { Mail, Users } from 'lucide-react';

const ClubCard = ({ club }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition">
      {club.image_url && <img src={club.image_url} alt={club.name} className="w-full h-32 object-cover" />}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{club.name}</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">{club.category}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{club.description}</p>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> <a href={`mailto:${club.contact_email}`} className="text-indigo-600 hover:underline">{club.contact_email}</a></div>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;