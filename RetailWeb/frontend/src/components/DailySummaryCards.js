import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FiCalendar } from "react-icons/fi";

const DailySummaryCard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/daily_sales_summary"
        );
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!summary) return null;

  return (
    <Card
      style={{
        borderRadius: "1rem",
        background: "hsl(222, 47%, 8%, 0.85)",
        backdropFilter: "blur(12px)",
        color: "hsl(210, 40%, 98%)",
        marginTop: "20px",
      }}
    >
      <Card.Header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderBottom: "1px solid hsl(222,30%,18%)",
        }}
      >
        <FiCalendar />
        Daily Sales Summary
      </Card.Header>

      <Card.Body>
        <Row className="text-center">
          {[
            { title: "Total Orders", value: summary.total_orders },
            { title: "Items Sold", value: summary.total_items_sold },
            { title: "Total Sales", value: summary.total_sales },
            { title: "Avg Order", value: summary.average_order_value },
          ].map((item, idx) => (
            <Col key={idx}>
              <p style={{ color: "hsl(215,20%,55%)" }}>{item.title}</p>
              <h3 style={{ fontFamily: "JetBrains Mono" }}>{item.value}</h3>
            </Col>
          ))}
        </Row>
      </Card.Body>

      <Card.Footer style={{ fontSize: "0.75rem", color: "hsl(215,20%,55%)" }}>
        {new Date(summary.date).toLocaleDateString()}
      </Card.Footer>
    </Card>
  );
};

export default DailySummaryCard;
