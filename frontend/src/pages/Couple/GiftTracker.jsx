import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Heading } from "../../components/ui/Typography";
import { api } from "../../api";
import { useTranslation } from "react-i18next";

export default function GiftTracker() {
  const { t } = useTranslation();
  const { eventId: EVENT_ID } = useParams();
  const [guests, setGuests] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGuest, setEditingGuest] = useState(null);
  const [giftForm, setGiftForm] = useState({ amount: "", notes: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gData, giftData] = await Promise.all([
        api.guests.getAll(EVENT_ID),
        api.gifts.getAll(EVENT_ID),
      ]);
      setGuests(gData || []);
      setGifts(giftData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const attendingGuests = guests.filter(
    (g) => g.rsvpStatus === "attending" || g.rsvpStatus === "Confirmed",
  );

  const getGiftForGuest = (guestName) => {
    return gifts.find(
      (g) => g.guestName.toLowerCase() === guestName.toLowerCase(),
    );
  };

  const handleEdit = (guest, existingGift) => {
    setEditingGuest(guest);
    if (existingGift) {
      setGiftForm({
        amount: existingGift.amount || "",
        notes: existingGift.notes || "",
      });
    } else {
      setGiftForm({ amount: "", notes: "" });
    }
  };

  const handleSave = async () => {
    if (!editingGuest) return;
    const gName =
      editingGuest.name ||
      editingGuest.fullName ||
      (
        (editingGuest.firstName || "") +
        " " +
        (editingGuest.lastName || "")
      ).trim();
    const existingGift = getGiftForGuest(gName);

    try {
      if (existingGift) {
        await api.gifts.update(EVENT_ID, existingGift.id, {
          guestName: gName,
          amount: parseFloat(giftForm.amount) || 0,
          notes: giftForm.notes,
        });
      } else {
        await api.gifts.create(EVENT_ID, {
          guestName: gName,
          amount: parseFloat(giftForm.amount) || 0,
          notes: giftForm.notes,
        });
      }
      setEditingGuest(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const totalAmount = gifts.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <Heading level={2} color="var(--color-primary)">
            {t("gifts_title")}
          </Heading>
          <div
            style={{ marginTop: "8px", fontSize: "1.1rem", fontWeight: 600 }}
          >
            {t("total_gathered")} {totalAmount}
          </div>
        </div>
      </header>

      {editingGuest && (
        <Card
          style={{
            padding: "1.5rem",
            marginBottom: "2rem",
            border: "2px solid var(--color-primary)",
          }}
        >
          <Heading level={4} style={{ marginBottom: "1rem" }}>
            {t("edit_gift_for")} {editingGuest.name || editingGuest.fullName}
          </Heading>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 150px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                {t("amount_money")}
              </label>
              <input
                type="number"
                min="0"
                value={giftForm.amount}
                onChange={(e) =>
                  setGiftForm({ ...giftForm, amount: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
                placeholder="ex: 500"
              />
            </div>
            <div style={{ flex: "2 1 250px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                {t("notes_physical_gift")}
              </label>
              <input
                type="text"
                value={giftForm.notes}
                onChange={(e) =>
                  setGiftForm({ ...giftForm, notes: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
                placeholder={t("notes_placeholder")}
              />
            </div>
            <Button onClick={handleSave}>{t("btn_save")}</Button>
            <Button variant="secondary" onClick={() => setEditingGuest(null)}>
              {t("btn_cancel")}
            </Button>
          </div>
        </Card>
      )}

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div className="p-8 text-center">{t("loading")}</div>
        ) : (
          <div className="table-responsive">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>{t("table_guest_confirmed")}</th>
                  <th>{t("table_sum")}</th>
                  <th>{t("table_gift_details")}</th>
                  <th>{t("table_actions")}</th>
                </tr>
              </thead>
              <tbody>
                {attendingGuests.map((g, i) => {
                  const gName =
                    g.name ||
                    g.fullName ||
                    ((g.firstName || "") + " " + (g.lastName || "")).trim();
                  const existingGift = getGiftForGuest(gName);

                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{gName}</td>
                      <td
                        style={{
                          color:
                            existingGift?.amount > 0
                              ? "var(--color-accent)"
                              : "inherit",
                          fontWeight: existingGift?.amount > 0 ? 600 : 400,
                        }}
                      >
                        {existingGift?.amount > 0 ? existingGift.amount : "-"}
                      </td>
                      <td style={{ color: "var(--color-text-secondary)" }}>
                        {existingGift?.notes || "-"}
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.8rem",
                            borderRadius: "12px",
                          }}
                          onClick={() => handleEdit(g, existingGift)}
                        >
                          {t("btn_modify")}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {attendingGuests.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      {t("no_confirmed_guests")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
