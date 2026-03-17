import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Heading, Text } from "../../components/ui/Typography";
import { api } from "../../api";

export default function Login({ onLogin, isRegister = false }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && !name.trim()) {
      setError("Numele este obligatoriu.");
      return;
    }

    if (!email.trim()) {
      setError("Email-ul este obligatoriu.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Adresa de email nu este validă.");
      return;
    }

    if (!password.trim()) {
      setError("Parola este obligatorie.");
      return;
    }

    if (password.length < 6) {
      setError("Parola trebuie sa aiba cel puţin 6 caractere.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await api.auth.register({
          email,
          username: name,
          password,
        });

        const res = await api.auth.login({ email, password });
        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);
        onLogin({ role: "client", email });
        navigate("/dashboard");
      } else {
        const res = await api.auth.login({ email, password });
        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);

        if (email === "admin@eternity.com") {
          onLogin({ role: "admin", email });
          navigate("/admin");
        } else {
          onLogin({ role: "client", email, package: t("pkg_premium") });
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      const msg = err?.message?.includes("401")
        ? "Date de autentificare incorecte."
        : "Eroare la autentificare.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="animate-fade-in-up"
      style={{
        minHeight: "calc(100vh - 200px)",
        padding: "4rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          maxWidth: "460px",
          width: "100%",
          padding: "3.5rem 3rem",
          borderRadius: "28px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
        }}
      >
        <div className="text-center" style={{ marginBottom: "2.5rem" }}>
          <Heading
            level={2}
            style={{
              fontSize: "2rem",
              marginBottom: "0.8rem",
              letterSpacing: "-0.04em",
            }}
          >
            {isRegister ? t("create_acc") : t("login_title")}
          </Heading>
          <Text secondary style={{ fontSize: "1.1rem" }}>
            {isRegister ? t("start_planning") : t("login_subtitle")}
          </Text>
        </div>

        {error && (
          <div
            style={{
              color: "red",
              backgroundColor: "#ffe6e6",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
        >
          {isRegister && (
            <div>
              <Input
                label={t("full_name")}
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <Input
              label={t("email")}
              type="text"
              placeholder="e.g. couple@wedding.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={false}
            />
          </div>
          <div>
            <Input
              label={t("password")}
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={false}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            style={{
              padding: "16px",
              borderRadius: "14px",
              fontSize: "1.1rem",
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : isRegister ? t("sign_up") : t("sign_in")}
          </Button>
        </form>

        <div
          className="text-center"
          style={{
            marginTop: "2.5rem",
            borderTop: "1px solid var(--color-border)",
            paddingTop: "2rem",
          }}
        >
          <Text secondary style={{ fontSize: "1rem", marginBottom: "1rem" }}>
            {isRegister ? t("already_acc") : t("dont_have_acc")}
            <Link
              to={isRegister ? "/login" : "/register"}
              style={{ fontWeight: 600, marginLeft: "5px" }}
            >
              {isRegister ? t("sign_in") : t("sign_up")}
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
