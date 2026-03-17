import React from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Heading } from "../../components/ui/Typography";

const PhotoGridItem = ({ url, index }) => (
  <Card
    style={{
      padding: 0,
      overflow: "hidden",
      height: "250px",
      cursor: "pointer",
      transition: "transform 0.2s",
      border: "none",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    <img
      src={url}
      alt={`Wedding ${index}`}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </Card>
);

export default function PhotoGallery() {
  const photos = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=300&q=80",
  ];

  return (
    <div
      className="container"
      style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
    >
      <header className="flex justify-between items-center mb-8">
        <Heading level={2} color="var(--color-primary)">
          Gallery
        </Heading>
        <Button style={{ borderRadius: "50px" }}>Upload Photo</Button>
      </header>

      <div className="flex gap-4 mb-8">
        <Button style={{ borderRadius: "20px" }}>Latest</Button>
        <Button variant="secondary" style={{ borderRadius: "20px" }}>
          Top Likes
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {photos.map((url, i) => (
          <PhotoGridItem key={i} url={url} index={i} />
        ))}
      </div>
    </div>
  );
}
