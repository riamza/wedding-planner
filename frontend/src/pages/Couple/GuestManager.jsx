import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Heading, Text } from "../../components/ui/Typography";
import { Badge } from "../../components/ui/Badge";
import { api } from "../../api";

const GuestManager = () => {
  const { t } = useTranslation();
  const [guests, setGuests] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", category: "Familie" });
  const [editingGuest, setEditingGuest] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");

  const [customGroups, setCustomGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [showAddGroup, setShowAddGroup] = useState(false);

  const { eventId: EVENT_ID } = useParams();

  useEffect(() => {
    loadData();
  }, [EVENT_ID]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gData, eData] = await Promise.all([
        api.guests.getAll(EVENT_ID),
        api.events.getById(EVENT_ID),
      ]);
      setGuests(gData || []); // Ensure array
      setEventDetails(eData);

      // Load groups from the event directly instead of localstorage
      if (eData?.customGroups) {
        const fetchedGroups = eData.customGroups
          .split(",")
          .filter((x) => x.trim().length > 0);
        setCustomGroups(fetchedGroups);
      } else {
        setCustomGroups(["Familie", "Prieteni"]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(customGroups));
    if (uniqueCats.length === 0) uniqueCats.push("Familie", "Prieteni");
    return ["All", ...uniqueCats];
  }, [customGroups]);
  const filteredGuests = useMemo(() => {
    if (!guests || !Array.isArray(guests)) return [];
    return guests.filter((g) => {
      const gName = g.name || g.fullName || g.firstName || "";
      const matchesSearch = gName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGroup =
        selectedGroup === "All" || g.category === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [guests, searchQuery, selectedGroup]);

  const handleAddCustomGroup = async () => {
    if (!newGroupName.trim() || customGroups.includes(newGroupName.trim()))
      return;
    try {
      const groupName = newGroupName.trim();
      const newGroupList = [...customGroups, groupName];
      setCustomGroups(newGroupList);

      await api.events.update(EVENT_ID, {
        customGroups: newGroupList.join(","),
      });

      setNewGroupName("");
      setShowAddGroup(false);
    } catch (e) {
      console.error("Failed to add custom group: ", e);
      alert("Failed to create group. Please try again.");
    }
  };

  const handleAddGuest = async () => {
    if (!newGuest.name) return;
    try {
      await api.guests.create(EVENT_ID, {
        name: newGuest.name,
        category: newGuest.category,
      });
      setNewGuest({ name: "", category: categories[1] || "Familie" });
      setShowAdd(false);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateGuest = async () => {
    if (!editingGuest || !editingGuest.id) return;
    try {
      await api.guests.update(EVENT_ID, editingGuest.id, {
        name: editingGuest.name,
        category: editingGuest.category,
        additionalGuests: editingGuest.additionalGuests || 0,
        children: editingGuest.children || 0,
        rsvpStatus: editingGuest.rsvpStatus,
      });
      setEditingGuest(null);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const copyGuestLink = (guest) => {
    const slug = eventDetails?.slug || EVENT_ID;
    const link =
      window.location.origin +
      "/invite/" +
      slug +
      "?guest=" +
      (guest.invitationToken || guest.id);
    navigator.clipboard.writeText(link);
    alert(t("btn_copy_link"));
  };

  const getBadgeColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "attending" || s === "confirmed") return "#6bb07b";
    if (s === "declined") return "#cf6679";
    return "var(--color-accent)";
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <Heading level={2} color="var(--color-primary)">
            {t("manage_guests_title")}
          </Heading>
          <Text secondary>{t("manage_guests_desc")}</Text>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="secondary"
            onClick={() => setShowAddGroup(!showAddGroup)}
          >
            {showAddGroup ? t("btn_cancel") : t("create_new_group")}
          </Button>
          <Button onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? t("btn_cancel") : t("btn_add")}
          </Button>
        </div>
      </header>

      {showAddGroup && (
        <Card
          style={{
            padding: "1rem",
            marginBottom: "2rem",
            border: "1px dashed var(--color-primary)",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                {t("group_name_label")}
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
                placeholder={t("group_name_placeholder")}
              />
            </div>
            <Button onClick={handleAddCustomGroup}>{t("btn_create")}</Button>
          </div>
        </Card>
      )}

      <Card style={{ padding: "1rem", marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 250px" }}>
            <Input
              placeholder={t("search_by_name")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Text secondary style={{ marginRight: "0.5rem" }}>
              {t("groups_label")}
            </Text>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedGroup === cat ? "primary" : "secondary"}
                onClick={() => setSelectedGroup(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                }}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {showAdd && (
        <Card style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <Heading level={4} style={{ marginBottom: "1rem" }}>
            {t("add_guest_title")}
          </Heading>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 200px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                {t("guest_name_label")}
              </label>
              <input
                type="text"
                value={newGuest.name}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
                placeholder={t("guest_name_placeholder")}
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                {t("group_label")}
              </label>
              <select
                value={newGuest.category}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, category: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                }}
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
            <Button onClick={handleAddGuest}>{t("btn_add")}</Button>
          </div>
        </Card>
      )}

      {editingGuest && (
        <Card
          style={{
            padding: "1.5rem",
            marginBottom: "2rem",
            border: "2px solid var(--color-primary)",
          }}
        >
          <Heading level={4} style={{ marginBottom: "1rem" }}>
            {t("edit_guest_title")} {editingGuest.name || editingGuest.fullName}
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
                {t("guest_name_label")}
              </label>
              <input
                type="text"
                value={editingGuest.name || ""}
                onChange={(e) =>
                  setEditingGuest({ ...editingGuest, name: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                }}
              />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                {t("group_label")}
              </label>
              <select
                value={editingGuest.category || ""}
                onChange={(e) =>
                  setEditingGuest({ ...editingGuest, category: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                }}
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
            <div style={{ flex: "1 1 100px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                {t("adults_children_plus")}
              </label>
              <div style={{ display: "flex", gap: "5px" }}>
                <input
                  type="number"
                  min={0}
                  value={editingGuest.additionalGuests || 0}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      additionalGuests: parseInt(e.target.value) || 0,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <input
                  type="number"
                  min={0}
                  value={editingGuest.children || 0}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      children: parseInt(e.target.value) || 0,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                  }}
                />
              </div>
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                {t("status_label")}
              </label>
              <select
                value={editingGuest.rsvpStatus || "Pending"}
                onChange={(e) =>
                  setEditingGuest({
                    ...editingGuest,
                    rsvpStatus: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  background: "transparent",
                }}
              >
                <option value="Pending">{t("status_pending")}</option>
                <option value="Attending">{t("status_attending")}</option>
                <option value="Declined">{t("status_declined")}</option>
              </select>
            </div>
            <Button onClick={handleUpdateGuest}>{t("btn_save")}</Button>
            <Button variant="secondary" onClick={() => setEditingGuest(null)}>
              {t("btn_cancel")}
            </Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="p-8 text-center">{t("loading")}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              <Heading level={4}>{t("main_guest_list")}</Heading>
            </div>
            <div className="table-responsive">
              <table className="ui-table">
                <thead>
                  <tr>
                    <th>{t("table_name")}</th>
                    <th>{t("table_status")}</th>
                    <th>{t("table_persons")}</th>
                    <th>{t("table_group")}</th>
                    <th>{t("table_unique_link")}</th>
                    <th>{t("table_actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((g) => (
                    <tr key={g.id}>
                      <td style={{ fontWeight: 500 }}>
                        {g.name ||
                          g.fullName ||
                          (
                            (g.firstName || "") +
                            " " +
                            (g.lastName || "")
                          ).trim()}
                      </td>
                      <td>
                        <Badge color={getBadgeColor(g.rsvpStatus)}>
                          {t(
                            "status_" +
                              (g.rsvpStatus || "Pending").toLowerCase(),
                          ) || g.rsvpStatus}
                        </Badge>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.85rem" }}>
                          {g.additionalGuests > 0
                            ? `+${g.additionalGuests} ${g.additionalGuests === 1 ? t("adult_singular") : t("adult_plural")} `
                            : ""}
                          {g.children > 0
                            ? `+${g.children} ${g.children === 1 ? t("child_singular") : t("child_plural")}`
                            : ""}
                          {!g.additionalGuests && !g.children ? (
                            <span style={{ color: "#aaa" }}>
                              {t("one_person")}
                            </span>
                          ) : (
                            ""
                          )}
                        </span>
                      </td>
                      <td>{g.category || "-"}</td>
                      <td>
                        <Button
                          variant="secondary"
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.8rem",
                            borderRadius: "12px",
                          }}
                          onClick={() => copyGuestLink(g)}
                        >
                          {t("btn_copy_link")}
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.8rem",
                            borderRadius: "12px",
                          }}
                          onClick={() => setEditingGuest(g)}
                        >
                          {t("btn_edit")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredGuests.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                        {t("no_guest_found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              <Heading level={4}>{t("special_req_title")}</Heading>
            </div>
            <div className="table-responsive">
              <table className="ui-table">
                <thead>
                  <tr>
                    <th>{t("table_name")}</th>
                    <th>{t("table_status")}</th>
                    <th>{t("table_special_req")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests
                    .filter((g) => g.notes && g.notes.length > 0)
                    .map((g) => (
                      <tr key={g.id + "_diet"}>
                        <td style={{ fontWeight: 500 }}>
                          {g.name || g.fullName}
                        </td>
                        <td>
                          <Badge color={getBadgeColor(g.rsvpStatus)}>
                            {t(
                              "status_" +
                                (g.rsvpStatus || "Pending").toLowerCase(),
                            ) || g.rsvpStatus}
                          </Badge>
                        </td>
                        <td style={{ color: "var(--color-text-secondary)" }}>
                          {g.notes}
                        </td>
                      </tr>
                    ))}
                  {filteredGuests.filter((g) => g.notes && g.notes.length > 0)
                    .length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center p-4">
                        {t("no_special_req")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--color-border)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              <Heading level={4}>{t("guest_messages_title")}</Heading>
            </div>
            <div className="table-responsive">
              <table className="ui-table">
                <thead>
                  <tr>
                    <th>{t("table_name")}</th>
                    <th>{t("table_message")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests
                    .filter((g) => g.message && g.message.length > 0)
                    .map((g) => (
                      <tr key={g.id + "_msg"}>
                        <td style={{ fontWeight: 500 }}>
                          {g.name || g.fullName}
                        </td>
                        <td style={{ color: "var(--color-text-secondary)" }}>
                          {g.message}
                        </td>
                      </tr>
                    ))}
                  {filteredGuests.filter(
                    (g) => g.message && g.message.length > 0,
                  ).length === 0 && (
                    <tr>
                      <td colSpan="2" className="text-center p-4">
                        {t("no_messages")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GuestManager;
