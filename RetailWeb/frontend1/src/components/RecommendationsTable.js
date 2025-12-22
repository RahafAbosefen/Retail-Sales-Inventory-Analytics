import React, { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";

const RecommendationsTable = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error(err));
  }, []);

  const getReason = (alert) => {
    if (alert.Inventory_State?.includes("Low Stock"))
      return "Low stock – demand exceeded supply";
    if (alert.Inventory_State?.includes("OVERSTOCK"))
      return "Overstock – slow moving item";
    if (alert.Behavior_Analysis?.includes("Critical"))
      return "Critical behavior – unexpected change in sales";
    return "Normal";
  };

  const reorderAlerts = alerts.filter((a) => a.Suggested_Order_Qty);

  return (
    <Card
      style={{
        borderRadius: "1rem",
        border: "1px solid hsl(222, 30%, 18%)",
        background: "hsl(222, 47%, 8%)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        marginBottom: "20px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          borderBottom: "1px solid hsl(222, 30%, 18%)",
          padding: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "hsl(187, 80%, 50%, 0.1)",
            color: "hsl(187, 80%, 50%)",
            padding: "0.5rem",
            borderRadius: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "2rem",
            minHeight: "2rem",
          }}
        >
          📦
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{ margin: 0, fontWeight: 700, color: "hsl(210, 40%, 98%)" }}
          >
            Inventory Reorder Recommendations
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "hsl(215, 20%, 55%)",
            }}
          >
            Suggested orders based on stock analysis
          </p>
        </div>
      </div>

      {/* Scrollable Table */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table
          responsive
          hover
          size="sm"
          className="mb-0"
          style={{
            backgroundColor: "hsl(222, 47%, 12%)",
            color: "hsl(210, 40%, 98%)",
            marginBottom: 0,
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid hsl(222,30%,18%)" }}>
              <th>Product Name</th>
              <th className="text-end">Current Stock</th>
              <th className="text-end">Recommended Order</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {reorderAlerts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-3">
                  No recommendations available
                </td>
              </tr>
            ) : (
              reorderAlerts.map((alert) => (
                <tr
                  key={alert._id}
                  style={{
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "hsl(222,47%,15%)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "hsl(222,47%,12%)")
                  }
                >
                  <td style={{ padding: "0.75rem 0.75rem" }}>
                    {alert.Product}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 0.75rem",
                      textAlign: "right",
                      fontFamily: "monospace",
                    }}
                  >
                    {alert.Stock}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 0.75rem",
                      textAlign: "right",
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    {alert.Suggested_Order_Qty}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem 0.75rem",
                      color: "hsl(215,20%,55%)",
                    }}
                  >
                    {getReason(alert)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default RecommendationsTable;
