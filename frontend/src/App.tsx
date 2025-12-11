import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CampsProvider } from "./contexts/CampsContext";
import CampsList from "./pages/CampsList";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <CampsProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<CampsList />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Layout>
      </Router>
    </CampsProvider>
  );
};

export default App;
