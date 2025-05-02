
import React from 'react';

const SortlyAiLogo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-primary">S</span>
      <span className="text-2xl font-bold text-primary">A</span>
      <span className="text-2xl font-bold text-yellow-500 relative">
        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 h-2 w-2 bg-yellow-500 rounded-full" />
        <span className="text-2xl font-bold text-gray-900">I</span>
      </span>
    </div>
  );
};

export default SortlyAiLogo;
