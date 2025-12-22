import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { io } from "socket.io-client";
import { FiCalendar } from "react-icons/fi";

const socket = io("http://localhost:5000");

const DailySummaryCard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    socket.on("daily_sales_summary", (data) => setSummary(data));
    return () => socket.off("daily_sales_summary");
  }, []);

  if (!summary) return null;

  return (
    <Card
      style={{
        borderRadius: "1rem",
        background: "hsl(222, 47%, 8%, 0.85)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        color: "hsl(210, 40%, 98%)",
        marginTop: "20px",
      }}
      className="animate-slide-up"
    >
      {/* Header */}
      <Card.Header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontWeight: 600,
          fontSize: "1.2rem",
          borderBottom: "1px solid hsl(222,30%,18%)",
          color: "hsl(210, 40%, 98%)",
        }}
      >
        <FiCalendar size={20} />
        Daily Sales Summary
      </Card.Header>

      {/* Body */}
      <Card.Body>
        <Row className="text-center">
          {[
            { title: "Total Orders", value: summary.total_orders },
            { title: "Items Sold", value: summary.total_items_sold },
            { title: "Total Sales", value: `$${summary.total_sales}` },
            { title: "Avg Order", value: `$${summary.average_order_value}` },
          ].map((item, idx) => (
            <Col key={idx}>
              <p style={{ fontSize: "0.875rem", color: "hsl(215,20%,55%)" }}>
                {item.title}
              </p>
              <h3
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 700,
                  fontSize: "1.875rem",
                  margin: 0,
                  color: "hsl(210,40%,98%)",
                }}
              >
                {item.value}
              </h3>
            </Col>
          ))}
        </Row>
      </Card.Body>

      {/* Footer */}
      <Card.Footer
        className="text-center"
        style={{ fontSize: "0.75rem", color: "hsl(215,20%,55%)" }}
      >
        {new Date(summary.date).toLocaleDateString()}
      </Card.Footer>
    </Card>
  );
};

export default DailySummaryCard;
