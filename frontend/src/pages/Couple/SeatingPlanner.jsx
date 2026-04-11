import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Heading, Text } from "../../components/ui/Typography";
import { Badge } from "../../components/ui/Badge";
import { api } from "../../api";

import { useTranslation } from "react-i18next";

const TableVisualizer = ({ table, onAssignClick, onDeleteClick }) => {
  const { t } = useTranslation();
  // We use table.seats because the backend updated it to Seats, but let's check DTO.
  // The DTO has: int Seats, int OccupiedSeats. So table.seats.
  // Wait, let's use table.seats || table.capacity for backwards compatibility.
  const capacity = table.seats || table.capacity;
  // Occupational computation is 1 + children + additional. For simplicity let's use length if not set.
  const occupied = table.occupiedSeats || table.guests?.length || 0;

  return (
    <Card
      className="flex flex-col items-center p-8 relative hover:shadow-md transition-shadow group"
      style={{ minHeight: "260px" }}
    >
      {onDeleteClick && (
        <button
          onClick={() => onDeleteClick(table.id)}
          className="absolute top-4 right-4 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm cursor-pointer border border-gray-100"
          title={t("delete_table", "Șterge masa")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      <Heading level={4} style={{ marginBottom: "1rem" }}>
        {table.name}
      </Heading>
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "4px solid var(--color-primary)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <Text secondary style={{ textAlign: "center" }}>
          {occupied} / {capacity} <br /> {t("seats")}
        </Text>
      </div>

      <div style={{ width: "100%", marginTop: "1rem" }}>
        <Text
          secondary
          style={{ fontSize: "0.85rem", marginBottom: "8px", display: "block" }}
        >
          {t("nav_guests")}:
        </Text>
        <div className="flex flex-col gap-2">
          {table.guests?.map((g, i) => {
            const numSeats = 1 + (g.additionalGuests || 0) + (g.children || 0);
            return (
              <div
                key={i}
                className="flex justify-between items-center"
                style={{
                  padding: "8px 12px",
                  backgroundColor: "var(--color-bg)",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                }}
              >
                <span>
                  {g.fullName || g.name || g.firstName + " " + g.lastName}
                </span>
                <span className="text-xs text-gray-500 font-medium bg-white px-2 py-0.5 rounded-full shadow-sm">
                  {numSeats} {numSeats === 1 ? "pers" : "persoane"}
                </span>
              </div>
            );
          })}
          {!table.guests?.length && (
            <Text
              secondary
              style={{ fontStyle: "italic", fontSize: "0.85rem" }}
            >
              {t("empty_table")}
            </Text>
          )}
        </div>
      </div>

      <Button
        variant="secondary"
        className="w-full mt-4"
        style={{ padding: "8px" }}
        onClick={() => onAssignClick(table)}
      >
        {t("assign_guests")}
      </Button>
    </Card>
  );
};

export default function SeatingPlanner() {
  const { t } = useTranslation();
  const [tables, setTables] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTable, setNewTable] = useState({ name: "", capacity: 10 });
  const { eventId: EVENT_ID } = useParams();

  // Assign Modal state
  const [assigningTable, setAssigningTable] = useState(null);
  const [selectedGuestIds, setSelectedGuestIds] = useState([]);
  const [groupFilter, setGroupFilter] = useState("");

  const handleAddTable = async () => {
    try {
      await api.seating.createTable(EVENT_ID, {
        name: newTable.name,
        seats: newTable.capacity,
      });
      setShowAdd(false);
      setNewTable({ name: "", capacity: 10 });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (
      !window.confirm(
        "Ești sigur că vrei să ștergi această masă? Toți invitații de la ea vor rămâne fără loc alocat.",
      )
    )
      return;
    try {
      await api.seating.deleteTable(EVENT_ID, tableId);
      loadData();
    } catch (e) {
      console.error(e);
      alert("Eroare la ștergerea mesei");
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [tData, gData] = await Promise.all([
        api.seating.getTables(EVENT_ID),
        api.guests.getAll(EVENT_ID),
      ]);
      setTables(tData);
      setGuests(gData);
    } catch (err) {
      console.error("Error loading seating data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalSeats = tables.reduce(
    (acc, t) => acc + (t.seats || t.capacity || 0),
    0,
  );
  const occupiedSeats = tables.reduce(
    (acc, t) => acc + (t.occupiedSeats || t.guests?.length || 0),
    0,
  );

  const openAssignModal = (table) => {
    setAssigningTable(table);
    setSelectedGuestIds(table.guests?.map((g) => g.id) || []);
    setGroupFilter("");
  };

  const closeAssignModal = () => {
    setAssigningTable(null);
    setSelectedGuestIds([]);
  };

  const toggleGuestSelect = (
    guestId,
    currentTotalSlots,
    guestSlots,
    capacity,
  ) => {
    if (selectedGuestIds.includes(guestId)) {
      setSelectedGuestIds(selectedGuestIds.filter((id) => id !== guestId));
    } else {
      if (currentTotalSlots + guestSlots <= capacity) {
        setSelectedGuestIds([...selectedGuestIds, guestId]);
      }
    }
  };

  const handleSaveAssigned = async () => {
    try {
      await api.seating.assignGuests(
        EVENT_ID,
        assigningTable.id,
        selectedGuestIds,
      );
      closeAssignModal();
      loadData(); // reload
    } catch (e) {
      console.error(e);
      alert("Error saving assignments");
    }
  };

  // We want to see all guests that are not explicitly declined
  const availableGuests = guests.filter(
    (g) => (g.rsvpStatus || "").toLowerCase() !== "declined",
  );
  const uniqueGroups = [
    ...new Set(
      availableGuests.map((g) => g.category || g.group).filter(Boolean),
    ),
  ];

  return (
    <div>
      <header className="flex flex-responsive justify-between items-center mb-8">
        <div>
          <Heading level={2} color="var(--color-primary)">
            {t("seating_planner")}
          </Heading>
          <Text secondary>{t("seating_subtitle")}</Text>
        </div>
        <div className="flex gap-4 items-center w-full sm:w-auto mt-4 sm:mt-0 justify-between sm:justify-end">
          <div style={{ textAlign: "left" }}>
            <Text style={{ fontWeight: 600 }}>
              {occupiedSeats} / {totalSeats} {t("seats")}
            </Text>
            <Text secondary style={{ fontSize: "0.8rem" }}>
              {t("assigned")}
            </Text>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)} className="mobile-full-btn">
            {showAdd ? t("btn_cancel") : t("add_table")}
          </Button>
        </div>
      </header>

      {showAdd && (
        <Card className="mb-8 p-6 fade-in flex gap-4 items-center flex-responsive">
          <Input
            placeholder={t("table_name")}
            value={newTable.name}
            onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
            style={{ flex: 1 }}
          />
          <Input
            placeholder={t("capacity")}
            type="number"
            min={1}
            value={newTable.capacity}
            onChange={(e) =>
              setNewTable({
                ...newTable,
                capacity: parseInt(e.target.value) || 0,
              })
            }
            style={{ width: "120px" }}
          />
          <Button className="mobile-full-btn" onClick={handleAddTable}>{t("btn_add")}</Button>
        </Card>
      )}

      {loading ? (
        <p>{t("loading_seating")}</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {tables.map((table, index) => (
            <TableVisualizer
              key={index}
              table={table}
              onAssignClick={openAssignModal}
              onDeleteClick={handleDeleteTable}
            />
          ))}
          {tables.length === 0 && <p>{t("no_tables")}</p>}
        </div>
      )}

      {assigningTable && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          style={{
            backgroundColor: "rgba(74, 59, 66, 0.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="w-full max-w-4xl bg-white flex flex-col shadow-2xl relative"
            style={{ 
              maxHeight: "85vh", 
              borderRadius: "24px", 
              border: "1px solid var(--color-border)",
              overflow: "hidden"
            }}
          >
            {/* Top accent border */}
            <div style={{
              height: "4px",
              background: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)",
              width: "100%",
            }}></div>
            {/* Header */}
            <div
              className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div>
                <Heading level={3} style={{ marginBottom: "0.25rem" }}>
                  {t("assign_guests")}
                </Heading>
                <Text secondary>
                  Pentru masa:{" "}
                  <span
                    style={{ fontWeight: 600, color: "var(--color-primary)" }}
                  >
                    {assigningTable.name}
                  </span>
                </Text>
              </div>
              {(() => {
                const currentSlots = availableGuests
                  .filter((ag) => selectedGuestIds.includes(ag.id))
                  .reduce(
                    (acc, ag) =>
                      acc + 1 + (ag.additionalGuests || 0) + (ag.children || 0),
                    0,
                  );
                const capacity =
                  assigningTable.seats || assigningTable.capacity || 0;
                const overCapacity = currentSlots > capacity;
                return (
                  <div className="text-right">
                    <div
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: overCapacity ? "#ef4444" : "var(--color-text)",
                      }}
                    >
                      {currentSlots}{" "}
                      <span
                        style={{
                          fontSize: "1rem",
                          color: "var(--color-text-secondary)",
                          fontWeight: 400,
                        }}
                      >
                        din {capacity} locuri
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Filter */}
            <div
              className="p-4 border-b bg-gray-50/50 flex gap-4 items-center"
              style={{ borderColor: "var(--color-border)" }}
            >
              <Text secondary style={{ whiteSpace: "nowrap" }}>
                Filtrează după grup:
              </Text>
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="ui-input flex-1 max-w-xs"
                style={{ padding: "8px" }}
              >
                <option value="">{t("all_groups", "Toate grupurile")}</option>
                {uniqueGroups.map((grp, i) => (
                  <option key={i} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>

            {/* Table / List */}
            <div className="flex-1 overflow-auto p-2 sm:p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
              <div className="flex flex-col gap-3">
                {availableGuests
                  .filter((g) => !groupFilter || (g.category || g.group) === groupFilter)
                  .map((g) => {
                    const guestSlots = 1 + (g.additionalGuests || 0) + (g.children || 0);
                    const isSelected = selectedGuestIds.includes(g.id);
                    
                    const currentTotalSlots = availableGuests
                      .filter((ag) => selectedGuestIds.includes(ag.id))
                      .reduce((acc, ag) => acc + 1 + (ag.additionalGuests || 0) + (ag.children || 0), 0);
                    
                    const capacity = assigningTable.seats || assigningTable.capacity || 0;
                    const isAlreadyElsewhere = g.tableId && g.tableId !== assigningTable.id;
                    const existingTable = tables.find((t) => t.id === g.tableId);
                    const groupName = g.category || g.group;
                    const willOvershoot = !isSelected && currentTotalSlots + guestSlots > capacity;

                    return (
                      <div
                        key={g.id}
                        onClick={() => {
                          if (willOvershoot) return;
                          toggleGuestSelect(g.id, currentTotalSlots, guestSlots, capacity);
                        }}
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${willOvershoot ? 'opacity-50 grayscale' : 'hover:shadow-md'}`}
                        style={{
                          backgroundColor: isSelected ? 'white' : 'var(--color-card)',
                          borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                          boxShadow: isSelected ? '0 4px 12px rgba(212, 163, 179, 0.2)' : 'none',
                        }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            <div
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 transition-colors"
                              style={{
                                borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                                backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                              }}
                            >
                              {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontWeight: isSelected ? 600 : 500, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                              {g.name || g.fullName || g.firstName + " " + g.lastName}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge color={isSelected ? 'var(--color-primary)' : 'gray'}>
                                {guestSlots} loc{guestSlots !== 1 ? 'uri' : ''}
                              </Badge>
                              {groupName && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>• {groupName}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          {isAlreadyElsewhere && !isSelected ? (
                            <span
                              style={{ fontSize: '0.7rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '12px' }}
                            >
                              La {existingTable ? existingTable.name : 'altă masă'}
                            </span>
                          ) : isSelected ? (
                            <span
                              style={{ fontSize: '0.7rem', backgroundColor: 'var(--color-primary)', color: 'white', padding: '4px 8px', borderRadius: '12px', opacity: 0.9 }}
                            >
                              Selectat
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                  
                  {availableGuests.filter((g) => !groupFilter || (g.category || g.group) === groupFilter).length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      Niciun invitat găsit
                    </div>
                  )}
              </div>
            </div>

            {/* Footer */}
            <div
              className="p-5 border-t flex justify-end gap-3"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              <Button variant="secondary" onClick={closeAssignModal}>
                {t("btn_cancel")}
              </Button>
              <Button onClick={handleSaveAssigned}>{t("btn_save")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
