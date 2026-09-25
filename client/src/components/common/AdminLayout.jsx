import React from 'react';
import AdminSidebar from './AdminSidebar';
import NotificationBell from './NotificationBell';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Header with Notification Bell */}
        <header className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-end">
          <NotificationBell />
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
