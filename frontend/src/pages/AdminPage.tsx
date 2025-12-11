// src/pages/AdminPage.tsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

const AdminPage: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [totalSlots, setTotalSlots] = useState<number>(20);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setError(null);
    setMsg(null);
    if (!name.trim()) {
      setError("Name required");
      return;
    }
    if (!startTime) {
      setError("Start time required");
      return;
    }

    try {
      const r = await axios.post(`${API_BASE}/admin/camps`, {
        name,
        description,
        location,
        start_time: startTime,
        total_slots: totalSlots,
      });
      setMsg(`Camp created (id=${r.data.id})`);
      setName("");
      setDescription("");
      setLocation("");
      setStartTime("");
      setTotalSlots(20);
    } catch (err: any) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to create"
      );
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin — Create Health Camp
      </Typography>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Camp name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />
            <TextField
              label="Start time (ISO)"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
            />
            <TextField
              label="Total slots"
              type="number"
              value={totalSlots}
              onChange={(e) => setTotalSlots(Number(e.target.value))}
              sx={{ width: 220 }}
            />

            {error && <Alert severity="error">{error}</Alert>}
            {msg && <Alert severity="success">{msg}</Alert>}

            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={create}>
                Create Camp
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setName("");
                  setDescription("");
                  setLocation("");
                  setStartTime("");
                  setTotalSlots(20);
                  setError(null);
                  setMsg(null);
                }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminPage;
