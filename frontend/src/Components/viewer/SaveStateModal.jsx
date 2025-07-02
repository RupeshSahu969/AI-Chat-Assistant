// src/components/viewer/SaveStateModal.jsx
import React, { useState } from 'react';

const SaveStateModal = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Save Current View</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="state-name" className="block text-sm font-medium text-gray-700 mb-1">
              View Name
            </label>
            <input
              type="text"
              id="state-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Front View"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2"
            >
              Save View
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveStateModal;