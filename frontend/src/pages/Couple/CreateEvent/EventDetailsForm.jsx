import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../../api";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Heading, Text } from "../../../components/ui/Typography";
import { CustomDatePicker } from "../../../components/ui/CustomDatePicker";
import { useTranslation } from "react-i18next";

const InputField = ({ label, required, placeholder, value, onChange }) => (
  <div style={{ marginBottom: "1rem" }}>
    <label
      style={{
        display: "block",
        marginBottom: "0.4rem",
        fontWeight: 500,
        fontSize: "0.95rem",
      }}
    >
      {label}{" "}
      {required && <span style={{ color: "var(--color-primary)" }}>*</span>}
    </label>
    <input
      required={required}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
    />
  </div>
);

export default function EventDetailsForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const selectedTemplate = location.state?.selectedTemplate;
  const selectedPkg = location.state?.selectedPkg || "Free";

  const [formData, setFormData] = useState({
    brideName: "",
    brideMotherName: "",
    brideFatherName: "",
    groomName: "",
    groomMotherName: "",
    groomFatherName: "",
    godmotherName: "",
    godfatherName: "",
    eventDate: "",
    location: "",
    schedule: "",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const newEvent = await api.events.create({
        brideName: formData.brideName,
        brideMotherName: formData.brideMotherName || null,
        brideFatherName: formData.brideFatherName || null,
        groomName: formData.groomName,
        groomMotherName: formData.groomMotherName || null,
        groomFatherName: formData.groomFatherName || null,
        godmotherName: formData.godmotherName || null,
        godfatherName: formData.godfatherName || null,
        eventDate: new Date(formData.eventDate).toISOString(),
        location: formData.location,
        schedule: formData.schedule || null,
        selectedPackage: selectedPkg,
        templateName: selectedTemplate,
      });
      navigate(`/dashboard/${newEvent.id}`);
    } catch (error) {
      console.error("Failed to create event", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        paddingBottom: "4rem",
      }}
    >
      <header
        className="glass-nav"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          className="container flex justify-between items-center"
          style={{
            height: "80px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--color-primary)",
            }}
          >
            WEDDIO
          </div>
          <Button
            onClick={() =>
              navigate("/create-event/packages", {
                state: { selectedTemplate },
              })
            }
            variant="secondary"
            style={{ borderRadius: "40px" }}
          >
            {t("back", "Înapoi")}
          </Button>
        </div>
      </header>

      <main
        className="container"
        style={{
          marginTop: "120px",
          maxWidth: "800px",
          margin: "120px auto 0 auto",
          padding: "0 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Heading level={2}>Creează Evenimentul Tău</Heading>
          <Text variant="muted">
            Completează detaliile necesare pentru a genera invitațiile digitale.
          </Text>
        </div>

        <form onSubmit={createEvent}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <Card style={{ padding: "2rem", borderRadius: "24px" }}>
              <Heading
                level={4}
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--color-primary)",
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: "0.5rem",
                }}
              >
                👰 Detalii Mireasă
              </Heading>
              <InputField
                label="Nume Mireasă"
                required
                placeholder="Ex: Maria"
                value={formData.brideName}
                onChange={handleChange("brideName")}
              />
              <InputField
                label="Nume Mama Miresei"
                placeholder="Ex: Elena"
                value={formData.brideMotherName}
                onChange={handleChange("brideMotherName")}
              />
              <InputField
                label="Nume Tatăl Miresei"
                placeholder="Ex: Vasile"
                value={formData.brideFatherName}
                onChange={handleChange("brideFatherName")}
              />
            </Card>

            <Card style={{ padding: "2rem", borderRadius: "24px" }}>
              <Heading
                level={4}
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--color-primary)",
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: "0.5rem",
                }}
              >
                🤵 Detalii Mire
              </Heading>
              <InputField
                label="Nume Mire"
                required
                placeholder="Ex: Ion"
                value={formData.groomName}
                onChange={handleChange("groomName")}
              />
              <InputField
                label="Nume Mama Mirelui"
                placeholder="Ex: Ana"
                value={formData.groomMotherName}
                onChange={handleChange("groomMotherName")}
              />
              <InputField
                label="Nume Tatăl Mirelui"
                placeholder="Ex: Gheorghe"
                value={formData.groomFatherName}
                onChange={handleChange("groomFatherName")}
              />
            </Card>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <Card style={{ padding: "2rem", borderRadius: "24px" }}>
              <Heading
                level={4}
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--color-primary)",
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: "0.5rem",
                }}
              >
                🕊️ Detalii Nași
              </Heading>
              <InputField
                label="Nume Nașă"
                placeholder="Ex: Andreea"
                value={formData.godmotherName}
                onChange={handleChange("godmotherName")}
              />
              <InputField
                label="Nume Naș"
                placeholder="Ex: Alexandru"
                value={formData.godfatherName}
                onChange={handleChange("godfatherName")}
              />
            </Card>

            <Card style={{ padding: "2rem", borderRadius: "24px" }}>
              <Heading
                level={4}
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--color-primary)",
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: "0.5rem",
                }}
              >
                📅 Detalii Eveniment
              </Heading>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  Data Evenimentului{" "}
                  <span style={{ color: "var(--color-primary)" }}>*</span>
                </label>
                <CustomDatePicker
                  required={true}
                  value={formData.eventDate}
                  onChange={handleChange("eventDate")}
                />
              </div>

              <InputField
                label="Locație (Oraș / Restaurant)"
                required
                placeholder="Ex: Restaurantul Viselor, București"
                value={formData.location}
                onChange={handleChange("location")}
              />

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.4rem",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  Plan / Program{" "}
                  <span
                    style={{
                      color: "#888",
                      fontSize: "0.8rem",
                      fontWeight: 400,
                    }}
                  >
                    (Opțional)
                  </span>
                </label>
                <textarea
                  placeholder="Ex: Cununia civilă la 14:00..."
                  value={formData.schedule}
                  onChange={handleChange("schedule")}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid var(--color-border)",
                    fontFamily: "inherit",
                    resize: "none",
                  }}
                />
              </div>
            </Card>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="primary"
              style={{
                padding: "16px 48px",
                borderRadius: "40px",
                fontSize: "1.1rem",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
              }}
            >
              Salvează și Generează Invitația
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
