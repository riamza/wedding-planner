import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";
import { Badge } from "../../components/ui/Badge";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ onLogout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([
    { id: 1, name: "Basic", price: "Free", status: "Active", users: 12 },
    { id: 2, name: "Premium", price: "49 / mo", status: "Active", users: 34 },
    { id: 3, name: "Ultimate", price: "99 / mo", status: "Active", users: 8 },
  ]);

  const [clients] = useState([
    {
      name: "John Doe",
      email: "john@wedding.com",
      pkg: "Premium",
      status: "Active",
      date: "Oct 12, 2026",
    },
    {
      name: "Alice Smith",
      email: "alice@wedding.com",
      pkg: "Basic",
      status: "Active",
      date: "Nov 05, 2026",
    },
    {
      name: "Michael Boss",
      email: "mike@weddings.com",
      pkg: "Ultimate",
      status: "Pending",
      date: "Dec 20, 2026",
    },
  ]);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div
      style={{
        backgroundColor: "var(--color-bg)",
        minHeight: "100vh",
        paddingBottom: "4rem",
      }}
    >
      {/* Modern Glass Header */}
      <header
        className="glass-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid var(--color-border)",
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="container flex justify-between items-center"
          style={{ height: "80px", padding: "0 2rem" }}
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "var(--color-text)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              W.
            </div>
            <div>
              <Heading
                level={3}
                style={{
                  margin: 0,
                  fontSize: "1.2rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("brand")} Admin
              </Heading>
              <Text secondary style={{ fontSize: "0.85rem", margin: 0 }}>
                Overview & Management
              </Text>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={handleLogout}
            style={{
              borderRadius: "20px",
              padding: "8px 20px",
              fontSize: "0.9rem",
            }}
          >
            {t("log_out")}
          </Button>
        </div>
      </header>

      <main
        className="container mx-auto"
        style={{ padding: "3rem 2rem", maxWidth: "1200px" }}
      >
        {/* Top KPIs / Metrics */}
        <section
          className="animate-fade-in-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          {[
            { label: "Total Clients", value: "54", trend: "+12% this month" },
            { label: "Active Packages", value: "3", trend: "All systems go" },
            {
              label: "Monthly Revenue",
              value: "8,450 RON",
              trend: "+5% this month",
            },
          ].map((metric, i) => (
            <Card
              key={i}
              className="hover-card-premium delay-100"
              style={{
                padding: "2rem",
                borderRadius: "24px",
                border: "1px solid var(--color-border)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              }}
            >
              <Text
                secondary
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.5rem",
                }}
              >
                {metric.label}
              </Text>
              <Heading
                level={2}
                style={{ fontSize: "2.5rem", margin: "0 0 0.5rem 0" }}
              >
                {metric.value}
              </Heading>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#34c759",
                  fontWeight: 500,
                }}
              >
                ↑ {metric.trend}
              </div>
            </Card>
          ))}
        </section>

        {/* Main Content Grid */}
        <section
          className="animate-fade-in-up delay-200"
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
        >
          {/* Recent Clients */}
          <Card
            style={{
              padding: "2.5rem",
              borderRadius: "28px",
              border: "1px solid var(--color-border)",
              boxShadow: "none",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <Heading level={3} style={{ fontSize: "1.5rem", margin: 0 }}>
                  {t("active_clients")}
                </Heading>
                <Text secondary style={{ marginTop: "0.25rem" }}>
                  Manage your recent signups and their plans.
                </Text>
              </div>
              <Button style={{ borderRadius: "20px", padding: "8px 20px" }}>
                Export CSV
              </Button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  marginTop: "1rem",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <th
                      style={{
                        padding: "1rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {t("client")}
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {t("contact")}
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {t("active_plan")}
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      Event Date
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        color: "var(--color-text-secondary)",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                      }}
                    >
                      {t("status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        transition: "background 0.2s",
                      }}
                    >
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          fontSize: "0.9rem",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {c.email}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <Badge
                          color={
                            c.pkg === "Ultimate"
                              ? "#1d1d1f"
                              : c.pkg === "Premium"
                                ? "#0066cc"
                                : "#888"
                          }
                        >
                          {c.pkg}
                        </Badge>
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          fontSize: "0.9rem",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {c.date}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <Badge
                          color={c.status === "Active" ? "#34c759" : "#ff9500"}
                        >
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pricing/Packages config */}
          <Card
            className="animate-fade-in-up delay-300"
            style={{
              padding: "2.5rem",
              borderRadius: "28px",
              border: "1px solid var(--color-border)",
              boxShadow: "none",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <Heading level={3} style={{ fontSize: "1.5rem", margin: 0 }}>
                  {t("sub_packages")}
                </Heading>
                <Text secondary style={{ marginTop: "0.25rem" }}>
                  Configure available tiers and pricing.
                </Text>
              </div>
              <Button
                variant="secondary"
                style={{ borderRadius: "20px", padding: "8px 20px" }}
              >
                {t("add_new")}
              </Button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
                marginTop: "1.5rem",
              }}
            >
              {packages.map((p, i) => (
                <div
                  key={p.id}
                  className={`hover-card-premium delay-${(i + 1) * 100}`}
                  style={{
                    padding: "1.5rem",
                    borderRadius: "20px",
                    backgroundColor: "none",
                    border: "1px solid #eaeaea",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <Text
                      style={{ fontWeight: 600, fontSize: "1.2rem", margin: 0 }}
                    >
                      {p.name}
                    </Text>
                    <Badge color="#34c759">{p.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Text secondary style={{ fontSize: "0.9rem" }}>
                      Users Active:{" "}
                      <strong style={{ color: "var(--color-text)" }}>
                        {p.users}
                      </strong>
                    </Text>
                    <Text style={{ fontWeight: 700 }}>{p.price}</Text>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full mt-2"
                    style={{ borderRadius: "12px" }}
                  >
                    {t("edit")} Tier
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
