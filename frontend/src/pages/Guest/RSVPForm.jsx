import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Heading, Text } from "../../components/ui/Typography";

const RSVPSuccess = ({ onBack }) => (
  <div
    className="container flex-col justify-center items-center"
    style={{ minHeight: "100vh", display: "flex" }}
  >
    <Card
      className="text-center"
      style={{ padding: "4rem 2rem", maxWidth: "500px", width: "100%" }}
    >
      <Heading level={1} color="var(--color-primary)" className="mb-4">
        ✓
      </Heading>
      <Heading level={3}>Thank you for confirming!</Heading>
      <Text secondary className="my-4">
        We cant wait to celebrate with you.
      </Text>
      <Button variant="secondary" onClick={onBack} className="mt-4">
        Back to Invitation
      </Button>
    </Card>
  </div>
);

const RSVPOptions = ({ attending, onChange }) => (
  <div className="flex justify-between gap-4 mb-8">
    <Button
      type="button"
      onClick={() => onChange(true)}
      style={{
        flex: 1,
        padding: "16px",
        background: attending ? "var(--color-primary)" : "var(--color-bg)",
        color: attending ? "#fff" : "var(--color-text)",
      }}
    >
      Yes, Id love to
    </Button>
    <Button
      type="button"
      onClick={() => onChange(false)}
      style={{
        flex: 1,
        padding: "16px",
        background: !attending ? "#2b2b2b" : "var(--color-bg)",
        color: !attending ? "#fff" : "var(--color-text)",
      }}
    >
      Regretfully decline
    </Button>
  </div>
);

const RSVPDetailsForm = ({ form, onChange }) => (
  <div className="flex-col gap-4 mb-8">
    <div className="flex gap-4">
      <Input
        label="Guests (+1s)"
        type="number"
        min="1"
        max="5"
        value={form.guests}
        onChange={(e) => onChange("guests", e.target.value)}
      />
      <Input
        label="Children"
        type="number"
        min="0"
        max="5"
        value={form.children}
        onChange={(e) => onChange("children", e.target.value)}
      />
    </div>
    <Input
      label="Dietary Preferences / Notes"
      type="textarea"
      rows="3"
      value={form.preferences}
      onChange={(e) => onChange("preferences", e.target.value)}
      placeholder="e.g., Vegetarian, gluten-free..."
    />
  </div>
);

export default function RSVPForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    attending: true,
    guests: 1,
    children: 0,
    message: "",
    preferences: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const updateForm = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return <RSVPSuccess onBack={() => navigate(`/${slug}`)} />;
  }

  return (
    <div
      className="container-sm"
      style={{ padding: "2rem 1rem", minHeight: "100vh" }}
    >
      <Button
        variant="ghost"
        onClick={() => navigate(`/${slug}`)}
        className="mb-8 p-0"
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        ← Go Back
      </Button>

      <Card style={{ padding: "3rem 2rem" }}>
        <Heading level={3} className="text-center mb-8">
          Will you attend?
        </Heading>

        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <RSVPOptions
            attending={form.attending}
            onChange={(val) => updateForm("attending", val)}
          />

          {form.attending && (
            <RSVPDetailsForm form={form} onChange={updateForm} />
          )}

          <Input
            label="A message for the couple (Optional)"
            type="textarea"
            rows="3"
            value={form.message}
            onChange={(e) => updateForm("message", e.target.value)}
            placeholder="Leave a sweet note..."
          />

          <Button
            type="submit"
            className="w-full mt-8"
            style={{ padding: "16px", fontSize: "1.2rem" }}
          >
            Confirm RSVP
          </Button>
        </form>
      </Card>
    </div>
  );
}
