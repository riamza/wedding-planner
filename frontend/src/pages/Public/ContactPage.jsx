import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Heading, Text } from "../../components/ui/Typography";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div style={{ paddingBottom: "8rem" }}>
      {/* Header Section */}
      <section
        style={{
          paddingTop: "10rem",
          paddingBottom: "6rem",
          background:
            "radial-gradient(circle at center top, rgb(255, 255, 255) 0%, rgb(245, 245, 247) 100%)",
          textAlign: "center",
        }}
      >
        <div
          className="container animate-fade-in-up"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <Heading
            level={1}
            style={{
              fontSize: "3.8rem",
              letterSpacing: "-0.04em",
              margin: "1.5rem 0",
            }}
          >
            {t("contact_us")}
          </Heading>
          <Text
            secondary
            style={{
              fontSize: "1.3rem",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            {t("contact_desc")}
          </Text>
        </div>
      </section>

      {/* Form Section */}
      <section
        className="container flex justify-center"
        style={{ marginTop: "-4rem", position: "relative", zIndex: 10 }}
      >
        <Card
          className="animate-fade-in-up delay-200"
          style={{ maxWidth: "600px", width: "100%", padding: "3rem" }}
        >
          <form className="flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex gap-4">
              <div className="w-full">
                <Input label={t("first_name_lbl")} placeholder="Jane" />
              </div>
              <div className="w-full">
                <Input label={t("last_name_lbl")} placeholder="Doe" />
              </div>
            </div>
            <Input
              label={t("email")}
              type="email"
              placeholder="jane@example.com"
            />
            <div className="flex-col">
              <label className="ui-label">{t("message_lbl")}</label>
              <textarea
                className="ui-input"
                rows="5"
                placeholder="..."
                style={{ resize: "vertical" }}
              ></textarea>
            </div>
            <Button
              type="submit"
              style={{
                padding: "16px",
                fontSize: "1.1rem",
                borderRadius: "12px",
              }}
            >
              {t("send_message")}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
