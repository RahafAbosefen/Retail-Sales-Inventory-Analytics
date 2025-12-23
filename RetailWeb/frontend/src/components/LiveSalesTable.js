import React, { useEffect, useState } from "react";
import { Card, Table, Badge } from "react-bootstrap";

const variantConfig = {
  "Flash Sale": { color: "hsl(0, 72%, 51%)", textColor: "#fff", icon: "⚡" },
  Discount: { color: "hsl(38, 92%, 50%)", textColor: "#000", icon: "💰" },
  Regular: { color: "hsl(142, 76%, 36%)", textColor: "#fff", icon: "📦" },
};

const LiveSalesTable = () => {
  const [sales, setSales] = useState([]);

  /* ===== Fetch function ===== */
  const fetchLiveSales = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/live_sales");
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error("Error fetching live sales:", err);
    }
  };

  /* ===== Poll every 1 second ===== */
  useEffect(() => {
    fetchLiveSales();
    const interval = setInterval(fetchLiveSales, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      style={{
        borderRadius: "1rem",
        background: "hsl(222, 47%, 8%)",
        border: "1px solid hsl(222, 30%, 18%)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        overflow: "hidden",
        marginTop: "20px",
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
          📊
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{ margin: 0, fontWeight: 700, color: "hsl(210, 40%, 98%)" }}
          >
            Live Sales
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              color: "hsl(215, 20%, 55%)",
            }}
          >
            Latest activity
          </p>
        </div>
      </div>

      {/* ===== Scroll Container (ONLY ADDITION) ===== */}
      <div
        style={{
          maxHeight: "380px",
          overflowY: "auto",
        }}
      >
        <Table
          responsive
          hover
          size="sm"
          className="mb-0"
          style={{
            backgroundColor: "hsl(222, 47%, 8%)",
            color: "hsl(210, 40%, 98%)",
            marginBottom: 0,
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid hsl(222,30%,18%)" }}>
              <th>Product</th>
              <th className="text-end">Qty</th>
              <th className="text-end">Total</th>
              <th>Offer</th>
              <th className="text-end">Time</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No live sales yet
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                const variant =
                  variantConfig[sale.Offer] || variantConfig.Regular;

                return (
                  <tr
                    key={sale._id}
                    style={{
                      cursor: "pointer",
                      transition: "background 0.2s",
                      height: "48px", // توسيع خفيف للصف
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "hsl(222,47%,12%)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "hsl(222,47%,8%)")
                    }
                  >
                    <td>{sale.Product}</td>

                    <td
                      className="text-end"
                      style={{ fontFamily: "monospace" }}
                    >
                      {sale.Qty}
                    </td>

                    <td
                      className="text-end"
                      style={{
                        fontFamily: "monospace",
                        color: "hsl(142,76%,36%)",
                      }}
                    >
                      ${sale.Total}
                    </td>

                    <td>
                      <Badge
                        style={{
                          backgroundColor: variant.color,
                          color: variant.textColor,
                        }}
                      >
                        {variant.icon} {sale.Offer}
                      </Badge>
                    </td>

                    <td
                      className="text-end"
                      style={{
                        fontSize: "0.85rem",
                        color: "hsl(215,20%,55%)",
                      }}
                    >
                      {new Date(sale.Time).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default LiveSalesTable;
