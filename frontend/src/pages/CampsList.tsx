// src/pages/CampsList.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import CampCard from "../components/CampCard";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

type Camp = {
  id: number;
  name: string;
  description?: string;
  location?: string;
  start_time?: string;
  total_slots: number;
  allocated_slots?: number | string | null;
};

const CampsListPage: React.FC = () => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/camps`)
      .then((r) => setCamps(r.data))
      .catch((e) => setError(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Upcoming Health Camps
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        }}
      >
        {camps.map((c) => (
          <CampCard
            key={c.id}
            id={c.id}
            name={c.name}
            description={c.description}
            location={c.location}
            start_time={c.start_time}
            total_slots={c.total_slots}
            allocated_slots={Number(c.allocated_slots || 0)}
          />
        ))}
      </Box>

      {camps.length === 0 && (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          No camps scheduled.
        </Typography>
      )}
    </Box>
  );
};

export default CampsListPage;
