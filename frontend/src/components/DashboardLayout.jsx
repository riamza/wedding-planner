import React, { useState } from "react";
import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";

export default function DashboardLayout({ user, onLogout }) {
  const { eventId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t("nav_overview") || "Overview", path: `/dashboard/${eventId}` },
    { name: t("nav_guests") || "Guests", path: `/dashboard/${eventId}/guests` },
    {
      name: t("nav_seating") || "Seating",
      path: `/dashboard/${eventId}/seating`,
    },
    {
      name: t("nav_vendors") || "Vendors",
      path: `/dashboard/${eventId}/vendors`,
    },
    { name: t("nav_gifts") || "Gifts", path: `/dashboard/${eventId}/gifts` },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
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
          style={{ height: "80px", position: "relative" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Link
              to={`/dashboard/${eventId}`}
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--color-text)",
                letterSpacing: "-0.02em",
                textDecoration: "none",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("brand") || "Weddio"}
            </Link>

            <nav className="flex gap-6 hide-on-mobile">
              {navLinks.map((link) => {
                const isActive =
                  link.path === `/dashboard/${eventId}`
                    ? location.pathname === `/dashboard/${eventId}`
                    : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      color: isActive
                        ? "var(--color-text)"
                        : "var(--color-text-secondary)",
                      fontWeight: isActive ? 600 : 500,
                      textDecoration: "none",
                      fontSize: "1.05rem",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div
            className="flex items-center hide-on-mobile"
            style={{ gap: "1.5rem" }}
          >
            {user && (
              <span
                style={{
                  fontSize: "0.95rem",
                  color: "var(--color-text-secondary)",
                }}
              ></span>
            )}
            <Button
              onClick={() => {
                if (onLogout) onLogout();
                navigate("/");
              }}
              variant="secondary"
              style={{
                padding: "8px 24px",
                fontSize: "0.95rem",
                borderRadius: "40px",
              }}
            >
              {t("log_out") || "Logout"}
            </Button>
          </div>

          <div
            className="show-on-mobile items-center"
            style={{ display: "none" }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "var(--color-text)",
              }}
            >
              {isMobileMenuOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="nav-menu-mobile show-on-mobile"
            style={{ display: "none", flexDirection: "column" }}
          >
            {navLinks.map((link) => {
              const isActive =
                link.path === `/dashboard/${eventId}`
                  ? location.pathname === `/dashboard/${eventId}`
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--color-text-secondary)",
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: "none",
                    fontSize: "1.2rem",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="flex-col gap-4 mt-4" style={{ width: "100%" }}>
              {user && (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                    fontSize: "0.9rem",
                  }}
                ></div>
              )}
              <Button
                onClick={() => {
                  if (onLogout) onLogout();
                  setIsMobileMenuOpen(false);
                  navigate("/");
                }}
                className="w-full"
                variant="secondary"
                style={{
                  padding: "12px",
                  fontSize: "1.1rem",
                  borderRadius: "40px",
                }}
              >
                {t("log_out") || "Logout"}
              </Button>
            </div>
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div
          className="show-on-mobile"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: "80px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
          }}
        />
      )}

      <main style={{ flex: 1, marginTop: "80px", padding: "2rem 0" }}>
        <div
          className="container"
          style={{ margin: "0 auto", padding: "0 20px" }}
        >
          <Outlet />
        </div>
      </main>

      <footer
        style={{
          backgroundColor: "var(--color-bg)",
          padding: "2rem 0",
          borderTop: "1px solid var(--color-border)",
          marginTop: "auto",
        }}
      >
        <div
          className="container flex justify-between items-center"
          style={{ margin: "0 auto", padding: "0 20px" }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: "1rem",
              color: "var(--color-text)",
            }}
          >
            {t("brand") || "Weddio"}
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              � {new Date().getFullYear()} {t("brand") || "Weddio"}.{" "}
              {t("all_rights_reserved") || "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
