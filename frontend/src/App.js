import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import UploadForm from "./Components/dashboard/UploadForm";
import ModelList from "./Components/dashboard/ModelList";
import { useAuth } from "./AuthContext/AuthContext";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import ModelViewer from "./Components/viewer/ModelViewer";
import Navbar from "./Pages/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return currentUser ? children : <Navigate to="/login" />;
};
const DashboardWrapper = () => {
  // This would be a component that includes UploadForm and ModelList
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <UploadForm onUpload={(model) => console.log("Uploaded:", model)} />
      <ModelList />
    </div>
  );
};
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardWrapper />
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/:modelId"
          element={
            <PrivateRoute>
              <ModelViewer />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer position="top-center" />
    </>
  );
}
export default App;
