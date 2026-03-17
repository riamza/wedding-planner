import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";

import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";
import { Badge } from "../../components/ui/Badge";
import { api } from "../../api";

const Dashboard = () => {
  const { t } = useTranslation();
  const [guests, setGuests] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [eventDetails, setEventDetails] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  const { eventId: EVENT_ID } = useParams();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [guestsData, vendorsData, evData] = await Promise.all([
        api.guests.getAll(EVENT_ID),
        api.vendors.getAll(EVENT_ID),
        api.events.getById(EVENT_ID),
      ]);
      setGuests(guestsData);
      setVendors(vendorsData);
      setEventDetails(evData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyGeneralLink = () => {
    if (!eventDetails) return;
    const link = window.location.origin + "/invite/" + eventDetails.slug;
    navigator.clipboard.writeText(link);
    setCopySuccess("Link copiat!");
    setTimeout(() => setCopySuccess(""), 3000);
  };

  const getStatusLabel = (status) => {
    if (status === "Confirmed") return t("status_confirmed");
    if (status === "Declined") return t("status_declined");
    return t("status_pending");
  };

  const stats = [
    {
      label: t("stat_invited"),
      value: guests.length,
      color: "var(--color-primary-hover)",
    },
    {
      label: t("status_confirmed"),
      value: guests.filter((g) => g.rsvpStatus === "Confirmed").length,
      color: "#6bb07b",
    },
    {
      label: t("status_declined"),
      value: guests.filter((g) => g.rsvpStatus === "Declined").length,
      color: "#cf6679",
    },
    {
      label: t("status_pending"),
      value: guests.filter((g) => g.rsvpStatus === "Pending" || !g.rsvpStatus)
        .length,
      color: "var(--color-accent)",
    },
  ];

  return (
    <div>
      <header
        className="mb-8"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <Heading level={2} color="var(--color-primary)">
            {eventDetails
              ? `${eventDetails.brideName} & ${eventDetails.groomName}`
              : t("dash_title")}
          </Heading>
          <Text secondary>
            {eventDetails
              ? new Date(eventDetails.eventDate).toLocaleDateString()
              : t("dash_subtitle")}
          </Text>
        </div>

        {eventDetails && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "0.85rem",
                background: "var(--color-bg)",
                padding: "8px 16px",
                borderRadius: "12px",
                border: "1px solid var(--color-border)",
              }}
            >
              {window.location.origin}/invite/{eventDetails.slug}
            </span>
            <Button onClick={copyGeneralLink} variant="primary">
              {copySuccess ? "Copiat!" : "Copiaza Link General"}
            </Button>
          </div>
        )}
      </header>

      {loading ? (
        <p>{t("loading_event")}</p>
      ) : (
        <>
          <div className="flex gap-4 mb-8" style={{ flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <Card
                key={i}
                style={{
                  flex: "1 1 200px",
                  borderLeft: `6px solid ${s.color}`,
                }}
                className="p-4"
              >
                <Text
                  secondary
                  style={{
                    textTransform: "uppercase",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </Text>
                <Heading level={2} className="mt-2" style={{ margin: 0 }}>
                  {s.value}
                </Heading>
              </Card>
            ))}
          </div>

          <div
            className="grid gap-8"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr", // Changed to full width to accommodate more columns natively
              gap: "2rem",
            }}
          >
            <Card className="p-8">
              <Heading
                level={4}
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                }}
              >
                {t("guest_status")}
              </Heading>
              <div className="table-responsive">
                <table
                  className="ui-table"
                  style={{ width: "100%", fontSize: "0.85rem" }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Nume</th>
                      <th style={{ textAlign: "center" }}>Grup</th>
                      <th style={{ textAlign: "center" }}>Preferințe</th>
                      <th style={{ textAlign: "center" }}>Mesaj</th>
                      <th style={{ textAlign: "right" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.slice(0, 5).map((g, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <td style={{ padding: "8px 0" }}>
                          <span style={{ fontWeight: "600" }}>
                            {g.name ||
                              g.fullName ||
                              `${g.firstName || ""} ${g.lastName || ""}`.trim()}
                          </span>
                        </td>
                        <td style={{ textAlign: "center", padding: "8px" }}>
                          <span
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {g.additionalGuests > 0
                              ? `+${g.additionalGuests} Adulți`
                              : ""}
                            {g.childrenCount > 0
                              ? ` / +${g.childrenCount} Copii`
                              : ""}
                          </span>
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={g.notes}
                        >
                          {g.notes || "-"}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={g.message}
                        >
                          {g.message || "-"}
                        </td>
                        <td style={{ textAlign: "right", padding: "8px 0" }}>
                          <Badge
                            color={
                              g.rsvpStatus === "Confirmed"
                                ? "#6bb07b"
                                : g.rsvpStatus === "Declined"
                                  ? "#cf6679"
                                  : "var(--color-accent)"
                            }
                          >
                            {getStatusLabel(g.rsvpStatus)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {guests.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ textAlign: "center", padding: "16px" }}
                        >
                          {t("no_guests")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-8">
              <Heading
                level={4}
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: "1rem",
                  marginBottom: "1rem",
                }}
              >
                {t("your_vendors")}
              </Heading>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {vendors.slice(0, 4).map((v, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Heading
                        level={5}
                        style={{ margin: "0 0 4px 0", fontSize: "1rem" }}
                      >
                        {v.name}
                      </Heading>
                      <Text secondary style={{ fontSize: "0.85rem" }}>
                        {v.category}
                      </Text>
                    </div>
                    <Badge color={v.isPaid ? "#6bb07b" : "var(--color-accent)"}>
                      {v.isPaid ? t("paid") : t("pending")}
                    </Badge>
                  </div>
                ))}
                {vendors.length === 0 && <p>{t("no_vendors")}</p>}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;
