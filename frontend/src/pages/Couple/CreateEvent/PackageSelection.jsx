import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Heading, Text } from "../../../components/ui/Typography";
import { useTranslation } from "react-i18next";

export default function PackageSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const selectedTemplate = location.state?.selectedTemplate;

  const packages = [
    {
      name: t("pkg_basic"),
      price: t("free"),
      features: [
        t("feat_50_guests"),
        t("feat_standard_inv"),
        t("feat_basic_rsvp"),
      ],
      value: "Free",
    },
    {
      name: t("pkg_premium"),
      price: "19$" + t("month"),
      features: [
        t("feat_200_guests"),
        t("feat_custom_inv"),
        t("feat_adv_seating"),
        t("feat_vendor_budg"),
      ],
      popular: true,
      value: "Premium",
    },
    {
      name: t("pkg_ultimate"),
      price: "49$" + t("month"),
      features: [
        t("feat_unlim_guests"),
        t("feat_full_custom"),
        t("feat_photo_gal"),
        t("feat_gift_track"),
        t("feat_prio_support"),
      ],
      value: "Ultimate",
    },
  ];

  const handlePackageSelect = (pkgValue) => {
    navigate("/create-event/details", {
      state: {
        selectedTemplate,
        selectedPkg: pkgValue,
      },
    });
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
            position: "relative",
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
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/create-event/templates")}
              variant="secondary"
              style={{ borderRadius: "40px" }}
            >
              {t("back", "Înapoi")}
            </Button>
          </div>
        </div>
      </header>

      <main
        className="container"
        style={{
          marginTop: "120px",
          maxWidth: "1000px",
          margin: "120px auto 0 auto",
          padding: "0 20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Heading
            level={2}
            style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
          >
            {t("choose_package")}
          </Heading>
          <Text secondary>{t("upgrade_anytime")}</Text>
        </div>

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
              style={{
                flex: "1 1 300px",
                maxWidth: "340px",
                textAlign: "center",
                padding: "2rem",
                borderRadius: "24px",
                border: pkg.popular
                  ? "2px solid var(--color-text)"
                  : "1px solid var(--color-border)",
                position: "relative",
              }}
            >
              {pkg.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "var(--color-text)",
                    color: "white",
                    padding: "4px 16px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {t("most_popular")}
                </div>
              )}
              <Text secondary style={{ fontSize: "1.2rem", fontWeight: 500 }}>
                {pkg.name}
              </Text>
              <Heading
                level={3}
                style={{ fontSize: "2.2rem", margin: "1rem 0 2rem 0" }}
              >
                {pkg.price}
              </Heading>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem 0",
                  textAlign: "left",
                  minHeight: "180px",
                }}
              >
                {pkg.features.map((feat, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--color-text)",
                        fontWeight: "bold",
                      }}
                    >
                      ✓
                    </span>
                    <Text as="span" style={{ fontSize: "0.95rem" }}>
                      {feat}
                    </Text>
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.popular ? "primary" : "secondary"}
                className="w-full"
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  width: "100%",
                }}
                onClick={() => handlePackageSelect(pkg.value)}
              >
                {t("select")} {pkg.name}
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
