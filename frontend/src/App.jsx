import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { api } from "./api";

import DashboardLayout from "./components/DashboardLayout";
import PublicLayout from "./components/layout/PublicLayout";

import EventList from "./pages/Couple/EventList";
import Dashboard from "./pages/Couple/Dashboard";
import GuestManager from "./pages/Couple/GuestManager";
import SeatingPlanner from "./pages/Couple/SeatingPlanner";
import VendorTracker from "./pages/Couple/VendorTracker";
import GiftTracker from "./pages/Couple/GiftTracker";

import Invitation from "./pages/Guest/Invitation";
import RSVPForm from "./pages/Guest/RSVPForm";
import PhotoGallery from "./pages/Guest/PhotoGallery";

import LandingPage from "./pages/Public/LandingPage";
import PricingPage from "./pages/Public/PricingPage";
import ContactPage from "./pages/Public/ContactPage";
import Login from "./pages/Public/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import TemplateSelection from "./pages/Couple/CreateEvent/TemplateSelection";
import PackageSelection from "./pages/Couple/CreateEvent/PackageSelection";
import EventDetailsForm from "./pages/Couple/CreateEvent/EventDetailsForm";

const ProtectedRoute = ({ children, allowedRoles, user }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/my-events"} replace />
    );
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      let token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        let decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // If Access Token is expired or expires in less than 30 seconds
        if (decoded.exp < currentTime + 30) {
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // Request new tokens proactively
          const response = await fetch(
            "http://localhost:5187/api/Auth/refresh",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token, refreshToken }),
            },
          );

          if (!response.ok) throw new Error("Refresh failing");

          const tokens = await response.json();
          localStorage.setItem("token", tokens.token);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          token = tokens.token;
          decoded = jwtDecode(token);
        }

        // Token is valid, setup user
        const userEmail =
          decoded.email ||
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ];
        const role = userEmail === "admin@eternity.com" ? "admin" : "client";

        setUser({ role, email: userEmail });
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  if (isInitializing) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/my-events" replace />
              ) : (
                <Login onLogin={setUser} isRegister={false} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/my-events" replace />
              ) : (
                <Login onLogin={setUser} isRegister={true} />
              )
            }
          />
        </Route>

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-events"
          element={
            <ProtectedRoute user={user} allowedRoles={["client"]}>
              <EventList user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event/templates"
          element={
            <ProtectedRoute user={user} allowedRoles={["client"]}>
              <TemplateSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event/packages"
          element={
            <ProtectedRoute user={user} allowedRoles={["client"]}>
              <PackageSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event/details"
          element={
            <ProtectedRoute user={user} allowedRoles={["client"]}>
              <EventDetailsForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:eventId"
          element={
            <ProtectedRoute user={user} allowedRoles={["client"]}>
              <DashboardLayout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="guests" element={<GuestManager />} />
          <Route path="seating" element={<SeatingPlanner />} />
          <Route path="vendors" element={<VendorTracker />} />
          <Route path="gifts" element={<GiftTracker />} />
        </Route>

        <Route path="/invite/:slug">
          <Route index element={<Invitation />} />
          <Route path="rsvp" element={<RSVPForm />} />
          <Route path="gallery" element={<PhotoGallery />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
