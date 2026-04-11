import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Heading, Text } from "../../components/ui/Typography";
import { Badge } from "../../components/ui/Badge";
import { api } from "../../api";

import { useTranslation } from "react-i18next";

const VendorCard = ({ vendor }) => {
  const { t } = useTranslation();
  const isPaid = vendor.isPaid || vendor.status === "Paid";
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <Heading level={4} style={{ margin: 0 }}>
            {vendor.name}
          </Heading>
          <Text secondary>{vendor.category}</Text>
        </div>
        <Badge color={isPaid ? "#6bb07b" : "var(--color-accent)"}>
          {isPaid ? t("paid") : t("pending")}
        </Badge>
      </div>

      <div
        className="flex justify-between items-center"
        style={{
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <Text style={{ fontWeight: 600 }}></Text>
        <Button
          variant="secondary"
          style={{ padding: "6px 16px", fontSize: "0.85rem" }}
        >
          {t("contact_btn")}
        </Button>
      </div>
    </Card>
  );
};

export default function VendorTracker() {
  const { t } = useTranslation();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  const { eventId: EVENT_ID } = useParams();

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await api.vendors.getAll(EVENT_ID);
      setVendors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = vendors.reduce(
    (acc, v) => acc + (v.cost || v.price || 0),
    0,
  );
  const paidAmount = vendors
    .filter((v) => v.isPaid || v.status === "Paid")
    .reduce((acc, v) => acc + (v.cost || v.price || 0), 0);

  return (
    <div>
      <header className="flex flex-responsive justify-between items-center mb-8">
        <div>
          <Heading level={2} color="var(--color-primary)">
            {t("vendors_title")}
          </Heading>
          <Text secondary>{t("vend_subtitle")}</Text>
        </div>
        <Button className="mobile-full-btn">{t("btn_add_vendor")}</Button>
      </header>

      <div className="flex gap-4 mb-8" style={{ flexWrap: "wrap" }}>
        <Card
          style={{
            flex: "1 1 200px",
            backgroundColor: "var(--color-primary)",
            color: "white",
          }}
        >
          <Text
            style={{
              color: "white",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              opacity: 0.8,
            }}
          >
            {t("total_budget")}
          </Text>
          <Heading level={2} style={{ color: "white", margin: "4px 0 0 0" }}>
            ${totalBudget.toLocaleString()}
          </Heading>
        </Card>
        <Card style={{ flex: "1 1 200px" }}>
          <Text
            secondary
            style={{ textTransform: "uppercase", fontSize: "0.8rem" }}
          >
            {t("paid_so_far")}
          </Text>
          <Heading level={2} style={{ margin: "4px 0 0 0" }}>
            ${paidAmount.toLocaleString()}
          </Heading>
        </Card>
        <Card style={{ flex: "1 1 200px" }}>
          <Text
            secondary
            style={{ textTransform: "uppercase", fontSize: "0.8rem" }}
          >
            {t("remaining")}
          </Text>
          <Heading level={2} style={{ margin: "4px 0 0 0" }}>
            ${(totalBudget - paidAmount).toLocaleString()}
          </Heading>
        </Card>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {loading ? (
          <p>{t("loading_vendors")}</p>
        ) : (
          vendors.map((v, i) => <VendorCard key={i} vendor={v} />)
        )}
      </div>
    </div>
  );
}
