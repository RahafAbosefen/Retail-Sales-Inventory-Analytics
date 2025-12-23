// components/AppNavbar.tsx
import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { FiWifi } from "react-icons/fi";

const AppNavbar = () => (
  <Navbar
    expand={false}
    variant="dark"
    style={{
      background: "hsl(222, 47%, 8%)", // نفس لون الكارد
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      padding: "0.75rem 1.5rem",
    }}
    sticky="top"
  >
    <Container className="d-flex justify-content-between align-items-center">
      {/* عنوان الداشبورد */}
      <Navbar.Brand
        href="#"
        style={{
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "hsl(210, 40%, 98%)", // لون نص الكارد
          textAlign: "center",
          flex: 1,
        }}
      >
        Inventory Dashboard
      </Navbar.Brand>

      {/* أيقونة Wi-Fi */}
      <div>
        <FiWifi size={24} color="hsl(142, 76%, 36%)" title="Connected" />
      </div>
    </Container>
  </Navbar>
);

export default AppNavbar;
