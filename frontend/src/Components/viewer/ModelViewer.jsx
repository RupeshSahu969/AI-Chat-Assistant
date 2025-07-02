import React, { useRef, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getModelFile, modelByID, saveSceneState, getSceneStates } from '../../services/api';
import Controls from './Controls';
import SaveStateModal from './SaveStateModal';
import { useAuth } from '../../AuthContext/AuthContext';

const ModelViewer = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const canvasRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedStates, setSavedStates] = useState([]);
  const [activeState, setActiveState] = useState(null);
  const [modelData, setModelData] = useState(null);
  
  // Three.js refs
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);
        setError('');
        
        // 1. Get model metadata
        const metadata = await modelByID(modelId);
        setModelData(metadata);
        
        // 2. Get model file
        const blob = await getModelFile(modelId);
        
        // 3. Create object URL
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        
        // 4. Get saved states
        const states = await getSceneStates(modelId);
        setSavedStates(states);
        
        // 5. Initialize scene
        initScene(url, metadata.originalName);
      } catch (err) {
        console.error('Model loading error:', err);
        
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          logout();
          navigate('/login');
          return;
        }
        
        setError('Failed to load model');
        setErrorDetails(err.message || 'Please check your network connection');
      } finally {
        setLoading(false);
      }
    };

    const initScene = (url, filename) => {
      if (!canvasRef.current) {
        throw new Error('Canvas element not found');
      }
      
      // Initialize scene
      const scene = sceneRef.current;
      scene.background = new THREE.Color(0xf0f0f0);
      
      // Initialize camera
      const camera = new THREE.PerspectiveCamera(
        75,
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;
      cameraRef.current = camera;
      
      // Initialize renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 15);
      scene.add(directionalLight);
      
      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 1;
      controls.maxDistance = 50;
      controlsRef.current = controls;
      
      // Determine file type
      const extension = filename.split('.').pop().toLowerCase();
      
      // Load model based on file type
      if (extension === 'glb' || extension === 'gltf') {
        const loader = new GLTFLoader();
        loader.load(
          url,
          (gltf) => {
            scene.add(gltf.scene);
          },
          undefined,
          (err) => {
            console.error('GLTF Loader error:', err);
            setError('Failed to load 3D model');
            setErrorDetails('The file might be corrupted or incompatible');
          }
        );
      } else if (extension === 'obj') {
        const loader = new OBJLoader();
        loader.load(
          url,
          (object) => {
            scene.add(object);
          },
          undefined,
          (err) => {
            console.error('OBJ Loader error:', err);
            setError('Failed to load 3D model');
            setErrorDetails('The file might be corrupted or incompatible');
          }
        );
      } else {
        throw new Error(`Unsupported file format: ${extension}`);
      }
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
      
      // Resize handler
      const handleResize = () => {
        camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        );
      };
      window.addEventListener('resize', handleResize);
      
      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        controls.dispose();
        renderer.dispose();
      };
    };

    if (modelId) fetchModel();
    
    // Cleanup on unmount
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [modelId, navigate, logout]);

  const handleSaveState = () => {
    setShowSaveModal(true);
  };

  const handleSave = async (name) => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    const state = {
      name,
      cameraPosition: cameraRef.current.position.toArray(),
      rotation: controlsRef.current.target.toArray(),
      zoom: cameraRef.current.zoom
    };
    
    try {
      const savedState = await saveSceneState(modelId, state);
      setSavedStates([savedState, ...savedStates]);
      setShowSaveModal(false);
    } catch (err) {
      console.error('Save state error:', err);
      setError('Failed to save view');
      setErrorDetails(err.response?.data?.message || 'Please try again');
    }
  };

  const applyState = (state) => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    cameraRef.current.position.set(...state.cameraPosition);
    controlsRef.current.target.set(...state.rotation);
    cameraRef.current.zoom = state.zoom;
    cameraRef.current.updateProjectionMatrix();
    controlsRef.current.update();
    setActiveState(state._id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-medium text-gray-800">Loading 3D Model</h2>
        <p className="text-gray-600 mt-2">This may take a moment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
        {errorDetails && <p className="text-gray-600 max-w-md text-center mb-6">{errorDetails}</p>}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-3"
          >
            Try Again
          </button>
          <Link
            to="/dashboard"
            className="btn-secondary px-6 py-3"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">3D Model Viewer</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSaveState}
            className="btn-primary flex items-center"
          >
            Save View
          </button>
          <Link
            to="/dashboard"
            className="btn-secondary flex items-center"
          >
            Dashboard
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-grow bg-gray-50">
        <div className="flex-grow relative bg-gray-900">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full min-h-[400px]"
          />
          {modelData && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md">
              {modelData.originalName}
            </div>
          )}
          <Controls controls={controlsRef} camera={cameraRef} />
        </div>
        
        <div className="lg:w-80 bg-white border-l p-4">
          <h3 className="text-lg font-semibold mb-4">Saved Views</h3>
          
          {savedStates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No saved views yet</p>
              <button 
                onClick={handleSaveState}
                className="text-blue-600 hover:underline mt-2"
              >
                Save your first view
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {savedStates.map((state) => (
                <div 
                  key={state._id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    activeState === state._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => applyState(state)}
                >
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">{state.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(state.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showSaveModal && (
        <SaveStateModal
          onSave={handleSave}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
};

export default ModelViewer;