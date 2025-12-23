import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LiveSalesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const res = await fetch("http://localhost:5000/api/live_sales");
      const sales = await res.json();

      const chartData = sales
        .slice()
        .reverse()
        .map((sale) => ({
          name: new Date(sale.Time).toLocaleTimeString(),
          total: Number(sale.Total) || 0,
        }));

      setData(chartData);
    };

    fetchSales();
    const interval = setInterval(fetchSales, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "hsl(222, 47%, 8%, 0.8)",
        border: "1px solid hsl(222, 30%, 18%)",
        borderRadius: "0.75rem",
        backdropFilter: "blur(4px)",
        padding: "1.5rem",
        animation: "slideUp 0.5s ease-out",
        animationDelay: "0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "hsl(210, 40%, 98%)",
              margin: 0,
            }}
          >
            Live Sales Performance
          </h3>
          <span style={{ fontSize: "0.875rem", color: "hsl(215, 20%, 55%)" }}>
            Updates every few seconds
          </span>
        </div>

        {/* Live Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "hsl(187, 80%, 50%, 0.1)",
            borderRadius: "9999px",
            padding: "0.375rem 0.75rem",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "hsl(187, 80%, 50%)",
            position: "relative",
          }}
        >
          <span
            className="pulse-dot"
            style={{
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "9999px",
              background: "hsl(187, 80%, 50%)",
              position: "relative",
            }}
          >
            <span
              style={{
                content: "''",
                position: "absolute",
                inset: "-0.25rem",
                borderRadius: "9999px",
                animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
                opacity: 0.4,
                background: "currentColor",
              }}
            />
          </span>
          Live
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(187, 80%, 50%)"
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor="hsl(187, 80%, 50%)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="hsl(222, 30%, 18%)" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            stroke="hsl(215, 20%, 55%)"
            fontSize={11}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            stroke="hsl(215, 20%, 55%)"
            fontSize={11}
            tickFormatter={(value) => `$${value}k`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(222, 47%, 8%)",
              border: "1px solid hsl(222, 30%, 18%)",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            labelStyle={{ color: "hsl(210, 40%, 98%)" }}
            itemStyle={{ color: "hsl(187, 80%, 50%)", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="hsl(187, 80%, 50%)"
            strokeWidth={2}
            fill="url(#salesGradient)"
            style={{ filter: "drop-shadow(0 0 8px hsl(187, 80%, 50%, 0.4))" }}
            dot={{ r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveSalesChart;
