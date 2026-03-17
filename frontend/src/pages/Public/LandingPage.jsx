import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";
import { RevealOnScroll } from "../../components/ui/RevealOnScroll";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={{ paddingBottom: "5rem" }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "8rem 20px 4rem 20px",
          background:
            "radial-gradient(circle at center, rgb(255, 255, 255) 0%, rgb(245, 245, 247) 100%)",
        }}
      >
        <div className="animate-fade-in-up" style={{ maxWidth: "800px" }}>
          <Heading
            level={1}
            style={{
              fontSize: "4.5rem",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
              color: "#1d1d1f",
            }}
          >
            {t("hero_title")}
          </Heading>
          <Text
            style={{
              fontSize: "1.5rem",
              color: "#86868b",
              maxWidth: "650px",
              margin: "0 auto 2.5rem auto",
              lineHeight: 1.5,
            }}
          >
            {t("hero_subtitle")}
          </Text>
          <div className="flex justify-center gap-4">
            <Button
              style={{
                padding: "16px 32px",
                fontSize: "1.1rem",
                borderRadius: "40px",
              }}
              onClick={() => navigate("/register")}
            >
              {t("start_free")}
            </Button>
            <Button
              variant="secondary"
              style={{
                padding: "16px 32px",
                fontSize: "1.1rem",
                borderRadius: "40px",
              }}
              onClick={() => navigate("/pricing")}
            >
              {t("view_pricing")}
            </Button>
          </div>
        </div>

        {/* Placeholder image representation */}
        <div
          className="animate-fade-in-scale delay-200"
          style={{
            marginTop: "5rem",
            width: "100%",
            maxWidth: "1100px",
            height: "420px",
            background:
              "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80) center/cover no-repeat",
            borderRadius: "32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        />
      </section>

      {/* About Us / What We Do Section */}
      <RevealOnScroll delay={100}>
        <section
          className="container text-center"
          style={{
            paddingTop: "10rem",
            paddingBottom: "8rem",
            maxWidth: "1000px",
          }}
        >
          <div className="flex-col gap-6 items-center">
            <Text
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              {t("about_us")}
            </Text>
            <Heading
              level={2}
              style={{
                fontSize: "3.2rem",
                maxWidth: "800px",
                margin: "0 auto",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {t("about_title")}
            </Heading>
            <Text
              style={{
                color: "#86868b",
                fontSize: "1.25rem",
                maxWidth: "700px",
                margin: "2rem auto",
                lineHeight: 1.6,
              }}
            >
              {t("about_desc")}
            </Text>
          </div>

          {/* Feature Grid */}
          <div
            className="grid-cards mt-8"
            style={{ marginTop: "5rem", gap: "2rem" }}
          >
            {[
              {
                title: t("feat_1_title"),
                desc: t("feat_1_desc"),
                icon: (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1d1d1f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                ),
              },
              {
                title: t("feat_2_title"),
                desc: t("feat_2_desc"),
                icon: (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1d1d1f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="8"
                      width="18"
                      height="8"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 16v4"></path>
                    <path d="M17 16v4"></path>
                    <path d="M7 8V4"></path>
                    <path d="M17 8V4"></path>
                  </svg>
                ),
              },
              {
                title: t("feat_3_title"),
                desc: t("feat_3_desc"),
                icon: (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1d1d1f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                ),
              },
            ].map((feat, i) => (
              <RevealOnScroll key={i} delay={i * 150}>
                <div
                  className="hover-card-premium"
                  style={{
                    background: "#fff",
                    padding: "3rem 2.5rem",
                    borderRadius: "28px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
                    border: "1px solid #eee",
                    height: "100%",
                  }}
                >
                  <div style={{ marginBottom: "1.5rem" }}>{feat.icon}</div>
                  <Heading
                    level={3}
                    style={{
                      fontSize: "1.6rem",
                      marginBottom: "1rem",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {feat.title}
                  </Heading>
                  <Text
                    secondary
                    style={{ fontSize: "1.15rem", lineHeight: 1.5 }}
                  >
                    {feat.desc}
                  </Text>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
