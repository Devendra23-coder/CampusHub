import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = "No data found", actionButton }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-gray-200">
    <div className="p-4 bg-gray-50 rounded-full mb-4">
      <Inbox className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-600 mb-4">{message}</p>
    {actionButton && <div>{actionButton}</div>}
  </div>
);

export default EmptyState;
