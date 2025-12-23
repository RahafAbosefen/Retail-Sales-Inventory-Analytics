import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  FaShoppingCart,
  FaDollarSign,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";

const variants = {
  primary: { color: "hsl(187, 80%, 50%)" },
  success: { color: "hsl(142, 76%, 36%)" },
  warning: { color: "hsl(38, 92%, 50%)" },
  danger: { color: "hsl(0, 72%, 51%)" },
};

const DashboardCards = () => {
  const [dailySummary, setDailySummary] = useState({
    total_orders: 0,
    total_sales: 0,
  });
  const [alerts, setAlerts] = useState([]);

  // Fetch data from REST APIs
  const fetchData = async () => {
    try {
      const summaryRes = await fetch(
        "http://localhost:5000/api/daily_sales_summary"
      );
      const summaryData = await summaryRes.json();
      setDailySummary(summaryData);

      const alertsRes = await fetch("http://localhost:5000/api/alerts");
      const alertsData = await alertsRes.json();
      setAlerts(alertsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();

    // Optional: refresh every X seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const lowStock = alerts.filter((a) =>
    a.Inventory_State?.includes("Low Stock")
  ).length;
  const overStock = alerts.filter((a) =>
    a.Inventory_State?.includes("OVERSTOCK")
  ).length;

  const cards = [
    {
      title: "Total Orders",
      value: dailySummary.total_orders,
      trend: "+12.5%",
      variant: "primary",
      icon: <FaShoppingCart />,
    },
    {
      title: "Total Sales",
      value: `$${dailySummary.total_sales}`,
      trend: "+8.3%",
      variant: "success",
      icon: <FaDollarSign />,
    },
    {
      title: "Low Stock",
      value: lowStock,
      trend: "-4.2%",
      variant: "danger",
      icon: <FaExclamationTriangle />,
    },
    {
      title: "Overstock",
      value: overStock,
      trend: "+3.1%",
      variant: "warning",
      icon: <FaChartLine />,
    },
  ];

  return (
    <Row className="g-3">
      {cards.map((c, idx) => {
        const color = variants[c.variant].color;
        const positiveTrend = c.trend.startsWith("+");

        return (
          <Col md={6} lg={3} key={idx}>
            <div
              style={{
                background: "hsl(222, 47%, 8%)",
                border: `1px solid ${color}33`,
                borderRadius: "1rem",
                padding: "1.5rem",
                backdropFilter: "blur(12px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "1rem",
                  background: `linear-gradient(135deg, ${color}0D, transparent)`,
                  pointerEvents: "none",
                }}
              />

              {/* Content */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "hsl(215, 20%, 55%)",
                    }}
                  >
                    {c.title}
                  </span>
                  <span
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: 700,
                      letterSpacing: "-0.025em",
                      color: "hsl(210, 40%, 98%)",
                      fontFamily: "JetBrains Mono",
                    }}
                  >
                    {c.value}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: positiveTrend
                        ? "hsl(142, 76%, 36%)"
                        : "hsl(0, 72%, 51%)",
                    }}
                  >
                    {c.trend}{" "}
                    <span style={{ color: "hsl(215, 20%, 55%)" }}>
                      vs last hour
                    </span>
                  </span>
                </div>

                <div
                  style={{
                    background: `${color}1A`,
                    color: color,
                    borderRadius: "0.75rem",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {c.icon}
                </div>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default DashboardCards;
