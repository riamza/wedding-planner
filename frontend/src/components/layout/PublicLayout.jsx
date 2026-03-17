import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";

export default function PublicLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t("nav_home") || "Acasă", path: "/" },
    { name: t("nav_pricing") || "Pachete", path: "/pricing" },
    { name: t("nav_contact") || "Contact", path: "/contact" },
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
      {/* Apple-style Glass Nav */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
            <Link
              to="/"
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--color-text)",
                letterSpacing: "-0.02em",
                textDecoration: "none",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("brand")}
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex gap-6 hide-on-mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color:
                      location.pathname === link.path
                        ? "var(--color-text)"
                        : "var(--color-text-secondary)",
                    fontWeight: location.pathname === link.path ? 600 : 500,
                    textDecoration: "none",
                    fontSize: "1.05rem",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Auth Buttons */}
          <div
            className="flex items-center hide-on-mobile"
            style={{ gap: "2rem" }}
          >
            <Link
              to="/login"
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--color-text)",
                textDecoration: "none",
                transition: "opacity 0.2s",
                opacity: 0.8,
              }}
              onMouseOver={(e) => (e.target.style.opacity = 1)}
              onMouseOut={(e) => (e.target.style.opacity = 0.8)}
            >
              {t("log_in")}
            </Link>
            <Button
              onClick={() => navigate("/register")}
              style={{
                padding: "10px 24px",
                fontSize: "1rem",
                borderRadius: "40px",
              }}
            >
              {t("get_started")}
            </Button>
          </div>

          {/* Mobile Burger Menu Button */}
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

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="nav-menu-mobile show-on-mobile"
            style={{ display: "none", flexDirection: "column" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  color:
                    location.pathname === link.path
                      ? "var(--color-text)"
                      : "var(--color-text-secondary)",
                  fontWeight: location.pathname === link.path ? 600 : 500,
                  textDecoration: "none",
                  fontSize: "1.2rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex-col gap-4 mt-4" style={{ width: "100%" }}>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  textDecoration: "none",
                  textAlign: "center",
                  padding: "0.5rem",
                }}
              >
                {t("log_in")}
              </Link>
              <Button
                onClick={() => {
                  navigate("/register");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full"
                style={{
                  padding: "12px",
                  fontSize: "1.1rem",
                  borderRadius: "40px",
                }}
              >
                {t("get_started")}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Overlay */}
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

      {/* Main Content Area */}
      <main style={{ flex: 1, marginTop: "80px" }}>
        <Outlet />
      </main>

      {/* Modern Minimal Footer */}
      <footer
        style={{
          backgroundColor: "var(--color-bg)",
          padding: "2rem 0",
          borderTop: "1px solid var(--color-border)",
          marginTop: "6rem",
        }}
      >
        <div className="container flex justify-between items-center px-6">
          <div
            style={{
              fontWeight: 600,
              fontSize: "1rem",
              color: "var(--color-text)",
            }}
          >
            {t("brand")}
          </div>
          <div style={{ display: "flex", gap: "2rem" }}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              &copy; {new Date().getFullYear()} {t("brand")}.{" "}
              {t("all_rights_reserved") || "All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
