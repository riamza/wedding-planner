import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Heading, Text } from "../../../components/ui/Typography";
import { useTranslation } from "react-i18next";
import { INVITATION_TEMPLATES } from "../../../utils/templates";

export default function TemplateSelection() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleTemplateSelect = (tId) => {
    setSelectedTemplate(tId);
    navigate("/create-event/packages", { state: { selectedTemplate: tId } });
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
            onClick={() => navigate("/my-events")}
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
          maxWidth: "1200px",
          margin: "120px auto 0 auto",
          padding: "0 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Heading
            level={2}
            style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
          >
            Alege un Design pentru Invitație
          </Heading>
          <Text secondary>
            Alege estetica evenimentului, textul va putea fi personalizat mai
            târziu.
          </Text>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {INVITATION_TEMPLATES.map((tpl) => (
            <Card
              key={tpl.id}
              style={{
                cursor: "pointer",
                transition: "0.2s",
                padding: "1.5rem",
                border:
                  selectedTemplate === tpl.id
                    ? "2px solid var(--color-primary)"
                    : "1px solid var(--color-border)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              onClick={() => handleTemplateSelect(tpl.id)}
            >
              <div
                style={{
                  height: "160px",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...tpl.style,
                }}
              >
                <span
                  style={{
                    fontSize: "1.2rem",
                    textAlign: "center",
                    fontFamily: tpl.style.fontFamily,
                  }}
                >
                  Invitație
                  <br />
                  {tpl.name}
                </span>
              </div>
              <div style={{ flexGrow: 1 }}>
                <Heading level={4} style={{ marginBottom: "0.5rem" }}>
                  {tpl.name}
                </Heading>
                <Text secondary style={{ fontSize: "0.9rem" }}>
                  {tpl.description}
                </Text>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(tpl);
                  }}
                >
                  Previzualizare
                </Button>
                <Button
                  variant={selectedTemplate === tpl.id ? "primary" : "primary"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(tpl.id);
                  }}
                >
                  {t("select", "Alege")}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {previewTemplate && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setPreviewTemplate(null)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "80vh",
                backgroundColor: "#fff",
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <Heading level={3} style={{ margin: 0 }}>
                  Previzualizare: {previewTemplate.name}
                </Heading>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f9fafb",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: "600px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    ...previewTemplate.style,
                    padding: "40px",
                    textAlign: "center",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: previewTemplate.style.fontFamily,
                      fontSize: "2.5rem",
                      margin: "0 0 20px 0",
                    }}
                  >
                    Maria & Ion
                  </h2>
                  <p
                    style={{
                      fontFamily: previewTemplate.style.fontFamily,
                      fontSize: "1.2rem",
                      margin: "0 0 10px 0",
                    }}
                  >
                    Vă invită să celebrați alături de ei
                  </p>
                  <p
                    style={{
                      fontFamily: previewTemplate.style.fontFamily,
                      fontSize: "1.5rem",
                      margin: "20px 0",
                    }}
                  >
                    15 August 2026
                  </p>
                  <p
                    style={{
                      fontFamily: previewTemplate.style.fontFamily,
                      fontSize: "1.2rem",
                      margin: "0",
                    }}
                  >
                    Restaurant Grand Palace
                  </p>
                </div>
              </div>
              <div
                style={{
                  padding: "15px",
                  borderTop: "1px solid #eee",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button
                  variant="secondary"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Închide
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleTemplateSelect(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                >
                  Alege acest design
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
