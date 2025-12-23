// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import AppNavbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Container style={{ paddingTop: "20px" }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
