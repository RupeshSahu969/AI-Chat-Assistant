import React, { useState } from 'react';
import { uploadModel } from '../../services/api';
import { toast } from 'react-toastify';

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  // const [orientation, setOrientation] = useState('landscape');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.warn('Please select a 3D model file');

    const formData = new FormData();
    formData.append('file', file);
    // formData.append('orientation', orientation);

    try {
      setLoading(true);
      const model = await uploadModel(formData);
      onUpload?.(model);
      setFile(null);
      toast.success('Model uploaded successfully!');
    } catch (err) {
      toast.error('Upload failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload 3D Model</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Choose .glb / .gltf / .obj file
            </label>
            <input
              type="file"
              accept=".glb,.gltf,.obj"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm file:bg-blue-50 file:border-0 file:px-4 file:py-2 file:rounded file:text-blue-600 file:cursor-pointer"
            />
          </div>
{/* 
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Orientation
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            >
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white  hover:text-white  py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
