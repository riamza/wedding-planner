import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Heading, Text } from "../../components/ui/Typography";

export default function PricingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const packages = [
    {
      name: t("pkg_basic"),
      price: t("free"),
      features: [
        t("feat_50_guests"),
        t("feat_standard_inv"),
        t("feat_basic_rsvp"),
      ],
    },
    {
      name: t("pkg_premium"),
      price: "" + t("month"),
      features: [
        t("feat_200_guests"),
        t("feat_custom_inv"),
        t("feat_adv_seating"),
        t("feat_vendor_budg"),
      ],
      popular: true,
    },
    {
      name: t("pkg_ultimate"),
      price: "" + t("month"),
      features: [
        t("feat_unlim_guests"),
        t("feat_full_custom"),
        t("feat_photo_gal"),
        t("feat_gift_track"),
        t("feat_prio_support"),
      ],
    },
  ];

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
            {t("choose_package")}
          </Heading>
          <Text
            secondary
            style={{
              fontSize: "1.3rem",
              lineHeight: 1.6,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {t("upgrade_anytime")}
          </Text>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section
        className="container"
        style={{ marginTop: "-4rem", position: "relative", zIndex: 10 }}
      >
        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {packages.map((pkg, i) => (
            <Card
              key={i}
              className={`animate-fade-in-up hover-card-premium delay-${(i + 1) * 100}`}
              style={{
                flex: "1 1 300px",
                maxWidth: "380px",
                textAlign: "center",
                position: "relative",
                padding: "3rem 2rem",
                borderRadius: "24px",
                border: pkg.popular
                  ? "2px solid var(--color-text)"
                  : "1px solid var(--color-border)",
                boxShadow: pkg.popular
                  ? "0 16px 40px rgba(0,0,0,0.08)"
                  : "0 4px 24px rgba(0,0,0,0.04)",
                transform: pkg.popular ? "scale(1.03)" : "none",
              }}
            >
              {pkg.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-14px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "var(--color-text)",
                    color: "white",
                    padding: "6px 20px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                  }}
                >
                  {t("most_popular")}
                </div>
              )}
              <Text secondary style={{ fontSize: "1.3rem", fontWeight: 500 }}>
                {pkg.name}
              </Text>
              <Heading
                level={2}
                style={{
                  fontSize: "3.2rem",
                  margin: "1rem 0 2.5rem 0",
                  letterSpacing: "-0.04em",
                }}
              >
                {pkg.price}
              </Heading>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 3rem 0",
                  textAlign: "left",
                  minHeight: "220px",
                }}
              >
                {pkg.features.map((feat, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "1.2rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{ color: "var(--color-text)", fontWeight: "bold" }}
                    >
                      ✓
                    </span>
                    <Text
                      as="span"
                      style={{ fontSize: "1.05rem", lineHeight: 1.4 }}
                    >
                      {feat}
                    </Text>
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.popular ? "primary" : "secondary"}
                className="w-full"
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  fontSize: "1.15rem",
                }}
                onClick={() => navigate("/register")}
              >
                {t("select")} {pkg.name}
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
