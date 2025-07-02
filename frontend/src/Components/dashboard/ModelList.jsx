import React, { useEffect, useState } from 'react';
import { getModels, deleteModel } from '../../services/api';
import { Link } from 'react-router-dom';

const ModelList = () => {
  const [models, setModels] = useState([]);

  const fetchModels = async () => {
    try {
      const data = await getModels();
      setModels(data);
    } catch (err) {
      console.error('Failed to fetch models', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this model?')) return;
    try {
      await deleteModel(id);
      fetchModels();
    } catch (err) {
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Uploaded Models</h2>

      {models.length === 0 ? (
        <p className="text-gray-600">No models uploaded yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {models.map((model) => (
            <div
              key={model._id}
              className="bg-gray-50 hover:bg-white transition-all border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-gray-900 truncate">{model.filename}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Orientation: <span className="capitalize">{model.orientation}</span>
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Link
                  to={`/viewer/${model._id}`}
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(model._id)}
                  className="text-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelList;
