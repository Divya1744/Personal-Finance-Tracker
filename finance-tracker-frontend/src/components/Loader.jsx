import React from 'react';

const Loader = () => (
    <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-t-4 border-primary border-t-transparent border-opacity-70 rounded-full animate-spin"></div>
    </div>
);

export default Loader;