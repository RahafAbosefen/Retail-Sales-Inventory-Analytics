// pages/DashboardCardsPage.js
import React, { useState } from "react";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import DashboardCards from "../components/DashboardCards";
import DailySummaryCards from "../components/DailySummaryCards";
import LiveSalesChart from "../components/LiveSalesChart";
import DashboardAlerts from "../components/DashboardAlerts";
import LiveSalesTable from "../components/LiveSalesTable";
import RecommendationsTable from "../components/RecommendationsTable";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const DashboardCardsPage = () => {
  const [key, setKey] = useState("live-sales");

  return (
    <Container fluid style={{ padding: "20px" }}>
      {/* KPI Cards */}
      <Row className="mb-4">
        <Col>
          <DashboardCards />
        </Col>
      </Row>

      {/* Daily Summary */}
      <Row className="mb-4">
        <Col>
          <DailySummaryCards />
        </Col>
      </Row>

      {/* Charts + Alerts */}
      <Row className="mb-4">
        <LiveSalesChart socket={socket} />
      </Row>
      <Row className="mb-4">
        <DashboardAlerts />
      </Row>

      {/* Tabs for Live Sales and Reorder Recommendations */}
      <Row>
        <Col>
          <Tabs
            id="dashboard-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="live-sales" title="Live Sales">
              <LiveSalesTable />
            </Tab>

            <Tab eventKey="recommendations" title="Reorder Recommendations">
              <RecommendationsTable />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardCardsPage;
