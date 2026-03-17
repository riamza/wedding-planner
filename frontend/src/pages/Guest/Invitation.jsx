import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Heading, Text } from "../../components/ui/Typography";
import { api } from "../../api";
import { INVITATION_TEMPLATES } from "../../utils/templates";

const RSVPSuccess = ({ attending }) => (
  <Card
    className="text-center mt-10"
    style={{ padding: "4rem 2rem", borderRadius: "24px" }}
  >
    <Heading
      level={1}
      color="var(--color-primary)"
      style={{ marginBottom: "1rem" }}
    >
      ✓
    </Heading>
    <Heading level={3}>Mulțumim pentru răspuns!</Heading>
    <Text secondary style={{ marginTop: "1rem" }}>
      {attending
        ? "Abia așteptăm să sărbătorim împreună!"
        : "Ne pare rău că nu poți ajunge, dar ne vom gândi la tine!"}
    </Text>
  </Card>
);

const RSVPOptions = ({ attending, onChange }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: "1rem",
      marginBottom: "2rem",
    }}
  >
    <Button
      type="button"
      onClick={() => onChange(true)}
      style={{
        flex: 1,
        padding: "16px",
        background: attending ? "var(--color-primary)" : "var(--color-bg)",
        color: attending ? "#fff" : "var(--color-text)",
        borderRadius: "12px",
        boxShadow: attending ? "0 4px 15px rgba(0,0,0,0.1)" : "none",
      }}
    >
      Da, voi participa
    </Button>
    <Button
      type="button"
      onClick={() => onChange(false)}
      style={{
        flex: 1,
        padding: "16px",
        background: attending === false ? "#2b2b2b" : "var(--color-bg)",
        color: attending === false ? "#fff" : "var(--color-text)",
        borderRadius: "12px",
        boxShadow: attending === false ? "0 4px 15px rgba(0,0,0,0.1)" : "none",
      }}
    >
      Nu pot ajunge
    </Button>
  </div>
);

const RSVPDetailsForm = ({ form, onChange }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginBottom: "2rem",
    }}
  >
    <div style={{ display: "flex", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <Input
          label="Invitați (+1)"
          type="number"
          min="1"
          max="5"
          value={form.guests}
          onChange={(e) => onChange("guests", e.target.value)}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Input
          label="Copii"
          type="number"
          min="0"
          max="5"
          value={form.children}
          onChange={(e) => onChange("children", e.target.value)}
        />
      </div>
    </div>
    <Input
      label="Preferințe alimentare / Alergi"
      type="text"
      value={form.preferences}
      onChange={(e) => onChange("preferences", e.target.value)}
      placeholder="ex: Vegetarian, fara gluten..."
    />
  </div>
);

const RSVPSection = ({ eventId }) => {
  const [searchParams] = useSearchParams();
  const guestToken = searchParams.get("guest") || searchParams.get("guestId");

  const [form, setForm] = useState({
    name: "",
    attending: true,
    guests: 1,
    children: 0,
    message: "",
    preferences: "",
  });

  useEffect(() => {
    if (guestToken) {
      api.guests
        .getByToken(guestToken)
        .then((data) => {
          if (data.name) {
            setForm((prev) => ({
              ...prev,
              name: data.name,
              guests: (data.additionalGuests || 0) + 1,
              children: data.children || 0,
            }));
          }
        })
        .catch((err) =>
          console.log("Guest details not loaded explicitly", err),
        );
    }
  }, [guestToken]);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        rsvpStatus: form.attending ? "Confirmed" : "Declined",
        additionalGuests: Math.max(0, parseInt(form.guests || 1) - 1),
        children: parseInt(form.children || 0),
        message: form.message,
        notes: form.preferences,
      };

      if (guestToken) {
        await api.guests.submitRsvpByToken(guestToken, payload);
      } else {
        await api.guests.submitRsvp(eventId, payload);
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Eroare la trimiterea confirmarii", error);
      alert("A aparut o eroare. Te rugam sa �ncerci din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return <RSVPSuccess attending={form.attending} />;

  return (
    <Card
      style={{
        padding: "3rem 2rem",
        marginTop: "3rem",
        borderRadius: "24px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
      }}
    >
      <Heading
        level={3}
        className="text-center mb-8"
        style={{
          fontFamily: '"Playfair Display", serif',
          marginBottom: "2rem",
        }}
      >
        Formular de Confirmare
      </Heading>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Input
          label="Nume și prenume"
          type="text"
          required
          value={form.name}
          onChange={(e) => updateForm("name", e.target.value)}
          placeholder="Ex: Popescu Ion"
        />

        <RSVPOptions
          attending={form.attending}
          onChange={(val) => updateForm("attending", val)}
        />

        {form.attending && (
          <RSVPDetailsForm form={form} onChange={updateForm} />
        )}

        <Input
          label="Un mesaj pentru miri (Opțional)"
          type="text"
          value={form.message}
          onChange={(e) => updateForm("message", e.target.value)}
          placeholder="Lasa-ne un g�nd bun..."
        />

        <Button
          type="submit"
          style={{
            padding: "16px",
            fontSize: "1.2rem",
            marginTop: "2rem",
            width: "100%",
            borderRadius: "100px",
          }}
        >
          Trimite Confirmarea
        </Button>
      </form>
    </Card>
  );
};

export default function Invitation() {
  const { slug } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.events.getBySlug(slug);
        setEventData(data);
      } catch (err) {
        setError("Invitația nu a putut fi găsită sau a fost ștearsă.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "4rem",
          fontSize: "1.2rem",
          color: "var(--color-text-secondary)",
        }}
      >
        Se �încarcă detaliile invitației...
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "4rem",
          color: "red",
          fontSize: "1.2rem",
        }}
      >
        {error || "Invitația nu a putut fi găsită."}
      </div>
    );
  }

  const templateSettings =
    INVITATION_TEMPLATES.find((t) => t.id === eventData.templateName) ||
    INVITATION_TEMPLATES[0];

  const familyDetails = {
    brideMother: eventData.brideMotherName,
    brideFather: eventData.brideFatherName,
    groomMother: eventData.groomMotherName,
    groomFather: eventData.groomFatherName,
    godmother: eventData.godmotherName,
    godfather: eventData.godfatherName,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: templateSettings.colors.bg || "var(--color-bg)",
        fontFamily: templateSettings.style.fontFamily || "inherit",
      }}
    >
      <div
        style={{
          ...templateSettings.style,
          width: "100%",
          padding: "6rem 2rem 10rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          borderBottomLeftRadius: "50% 10%",
          borderBottomRightRadius: "50% 10%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.4)",
          }}
        ></div>
        <Heading
          level={1}
          style={{
            color: templateSettings.colors.text,
            fontSize: "4.5rem",
            marginBottom: "1rem",
            zIndex: 2,
            fontFamily: templateSettings.style.fontFamily,
            textShadow: "0 2px 10px rgba(255,255,255,0.8)",
          }}
        >
          {eventData.brideName} &amp; {eventData.groomName}
        </Heading>
      </div>

      <div
        className="container-sm"
        style={{
          flex: 1,
          paddingBottom: "4rem",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <Card
          className="text-center"
          style={{
            marginTop: "-6rem",
            zIndex: 10,
            position: "relative",
            padding: "3rem",
            borderRadius: "24px",
            borderColor: templateSettings.colors.accent,
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Text
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "var(--color-text-secondary)",
              marginBottom: "2rem",
            }}
          >
            Noi, mirii, alături de părinții noștri:
            <br />
            <span style={{ fontWeight: 600, color: "var(--color-text)" }}>
              {familyDetails.brideMother && familyDetails.brideFather
                ? `${familyDetails.brideMother} și ${familyDetails.brideFather}`
                : "Părinții miresei"}{" "}
              și{" "}
              {familyDetails.groomMother && familyDetails.groomFather
                ? `${familyDetails.groomMother} și ${familyDetails.groomFather}`
                : "Părinții mirelui"}
            </span>
            <br />
            <br />
            și de nașii noștri:
            <br />
            <span
              style={{
                fontWeight: 600,
                color: "var(--color-text)",
                fontSize: "1.2rem",
              }}
            >
              {familyDetails.godmother && familyDetails.godfather
                ? `${familyDetails.godmother} & ${familyDetails.godfather}`
                : "Nașii"}
            </span>
          </Text>

          <div
            style={{
              margin: "3rem 0",
              width: "100%",
              height: "1px",
              background: "var(--color-border)",
            }}
          />

          <Heading
            level={3}
            style={{
              color: templateSettings.colors.accent,
              fontSize: "1.8rem",
              marginBottom: "1rem",
            }}
          >
            {new Date(eventData.eventDate).toLocaleDateString("ro-RO", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Heading>
          <Text
            style={{
              fontWeight: 600,
              fontSize: "1.3rem",
              marginBottom: "2rem",
            }}
          >
            {eventData.location}
          </Text>

          <div
            style={{
              padding: "1.5rem",
              background: "var(--color-bg)",
              borderRadius: "16px",
              fontStyle: "italic",
            }}
          >
            "
            {eventData.invitationMessage ||
              "Vă așteptăm cu drag să ne fiți alături în această zi specială pentru noi!"}
            "
          </div>
        </Card>

        {eventData.schedule && (
          <Card
            className="mb-10 mt-10 p-8 text-center"
            style={{ background: "#fff", borderRadius: "24px" }}
          >
            <Heading
              level={3}
              style={{
                marginBottom: "2rem",
                color: "var(--color-text)",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Programul Evenimentului
            </Heading>
            <Text
              style={{
                whiteSpace: "pre-wrap",
                fontSize: "1.1rem",
                lineHeight: "2",
                color: "var(--color-text-secondary)",
              }}
            >
              {eventData.schedule}
            </Text>
          </Card>
        )}

        <div id="rsvp-section">
          <RSVPSection eventId={eventData.id} />
        </div>
      </div>

      <footer
        className="text-center p-8"
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "0.9rem",
          marginTop: "auto",
        }}
      ></footer>
    </div>
  );
}
