import React, { useEffect, useState } from "react";
import { Row, Col, Card, ListGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const DashboardAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch(console.error);
  }, []);

  const categories = [
    {
      key: "Low Stock",
      color: "hsla(0, 52%, 33%, 1.00)",
      icon: "bi-box-seam",
    },
    {
      key: "OVERSTOCK",
      color: "hsla(38, 59%, 48%, 1.00)",
      icon: "bi-trending-up",
    },
    {
      key: "Critical",
      color: "hsla(262, 39%, 28%, 1.00)",
      icon: "bi-zap",
    },
    {
      key: "Flash",
      color: "hsla(187, 62%, 30%, 1.00)",
      icon: "bi-lightning-charge",
    },
  ];

  const renderList = (arr, bgColor) =>
    arr.map((a) => (
      <ListGroup.Item
        key={a._id}
        style={{
          border: "none",
          background: "transparent",
          color: "#fff",
          padding: "8px 12px",
          cursor: "pointer",
        }}
        className="hover-bg"
      >
        {a.Product}
      </ListGroup.Item>
    ));

  const filterAlerts = (key) => {
    if (key === "Low Stock")
      return alerts.filter((a) => a.Inventory_State?.includes("Low Stock"));
    if (key === "OVERSTOCK")
      return alerts.filter((a) => a.Inventory_State?.includes("OVERSTOCK"));
    if (key === "Critical")
      return alerts.filter((a) => a.Behavior_Analysis?.includes("Critical"));
    if (key === "Flash")
      return alerts.filter((a) => a.Offer?.toLowerCase().includes("flash"));
    return [];
  };

  return (
    <Row>
      {categories.map((cat) => (
        <Col md={3} key={cat.key}>
          <Card
            style={{
              borderRadius: "0.75rem",
              background: "rgba(18, 18, 28, 0.8)",
              backdropFilter: "blur(10px)",
              boxShadow: `0 0 15px ${cat.color}`,
              marginBottom: "15px",
              overflow: "hidden",
            }}
          >
            <Card.Header
              style={{
                background: cat.color,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                borderTopLeftRadius: "0.75rem",
                borderTopRightRadius: "0.75rem",
              }}
            >
              <i
                className={`bi ${cat.icon}`}
                style={{ fontSize: "1.2rem" }}
              ></i>
              <span>
                {cat.key} ({filterAlerts(cat.key).length})
              </span>
            </Card.Header>
            <Card.Body
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                padding: "0",
              }}
            >
              <ListGroup variant="flush">
                {renderList(filterAlerts(cat.key))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardAlerts;
