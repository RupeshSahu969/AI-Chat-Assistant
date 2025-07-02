// src/components/viewer/Controls.jsx
import React from 'react';

const Controls = ({ controls, camera }) => {
  if (!controls || !camera) return null;

  const handleReset = () => {
    controls.reset();
  };

  const handleZoomIn = () => {
    camera.zoom += 0.2;
    camera.updateProjectionMatrix();
  };

  const handleZoomOut = () => {
    camera.zoom = Math.max(0.2, camera.zoom - 0.2);
    camera.updateProjectionMatrix();
  };

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleReset}
          className="bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-lg shadow-md flex items-center justify-center"
          title="Reset View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          onClick={handleZoomIn}
          className="bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-lg shadow-md flex items-center justify-center"
          title="Zoom In"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-lg shadow-md flex items-center justify-center"
          title="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Controls;