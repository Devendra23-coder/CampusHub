import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full min-h-[200px]">
    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
  </div>
);

export default LoadingSpinner;
