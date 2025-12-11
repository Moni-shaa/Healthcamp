// src/pages/BookingPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Divider,
  Chip,
  Snackbar,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const campId = Number(id);

  const [camp, setCamp] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [numSlots, setNumSlots] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/camps/${campId}`)
      .then((r) => setCamp(r.data))
      .catch(() => setCamp(null));
  }, [campId]);

  const available = camp ? camp.total_slots - (camp.allocated_slots || 0) : 0;

  const submit = async () => {
    setError(null);
    setResult(null);
    if (!name.trim()) {
      setError("Enter your name");
      return;
    }
    if (numSlots <= 0) {
      setError("Choose at least one slot");
      return;
    }
    if (numSlots > available) {
      setError(`Only ${available} slots available`);
      return;
    }

    setLoading(true);
    try {
      const resp = await axios.post(`${API_BASE}/camps/${campId}/book`, {
        user_name: name,
        user_contact: contact,
        num_slots: numSlots,
      });
      setResult(resp.data);
      setSnackOpen(true);
      const fresh = await axios.get(`${API_BASE}/camps/${campId}`);
      setCamp(fresh.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!camp) return <Typography>Loading camp…</Typography>;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        gap: 2,
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="h4">{camp.name}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {camp.description}
          </Typography>

          <Stack spacing={1} sx={{ mb: 2 }}>
            <Typography>
              <strong>When:</strong>{" "}
              {new Date(camp.start_time).toLocaleString()}
            </Typography>
            <Typography>
              <strong>Location:</strong> {camp.location}
            </Typography>
            <Typography>
              <strong>Available slots:</strong> {available} / {camp.total_slots}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={2}>
              <TextField
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Contact (phone or email)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                fullWidth
              />
              <TextField
                label="Number of slots"
                type="number"
                inputProps={{ min: 1, max: Math.max(1, available) }}
                value={numSlots}
                onChange={(e) => setNumSlots(Number(e.target.value))}
                sx={{ width: 160 }}
              />

              {error && <Alert severity="error">{error}</Alert>}
              {result && (
                <Alert
                  severity={
                    result.status === "CONFIRMED" ? "success" : "warning"
                  }
                >
                  <div>
                    <strong>Status:</strong> {result.status}
                  </div>
                  {result.bookingId && (
                    <div>
                      <strong>Booking ID:</strong> {result.bookingId}
                    </div>
                  )}
                </Alert>
              )}

              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={submit} disabled={loading}>
                  {loading ? "Booking…" : "Confirm Booking"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setName("");
                    setContact("");
                    setNumSlots(1);
                    setError(null);
                    setResult(null);
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ background: "#fff" }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Camp summary
          </Typography>
          <Chip label={`Total: ${camp.total_slots}`} sx={{ mr: 1 }} />
          <Chip
            label={`Allocated: ${camp.allocated_slots || 0}`}
            sx={{ mr: 1 }}
          />
          <Chip label={`Available: ${available}`} />
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Bookings are processed atomically; concurrency safety prevents
            overbooking.
          </Typography>
        </CardContent>
      </Card>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message={
          result?.status === "CONFIRMED"
            ? "Booking confirmed"
            : "Booking processed"
        }
      />
    </Box>
  );
};

export default BookingPage;
