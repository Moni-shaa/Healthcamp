// src/components/CampCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

type Props = {
  id: number;
  name: string;
  description?: string;
  location?: string;
  start_time?: string;
  total_slots: number;
  allocated_slots?: number;
};

const CampCard: React.FC<Props> = ({
  id,
  name,
  description,
  location,
  start_time,
  total_slots,
  allocated_slots = 0,
}) => {
  const available = Math.max(0, total_slots - (allocated_slots || 0));
  return (
    <Card
      sx={{ transition: "box-shadow .18s ease", "&:hover": { boxShadow: 6 } }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
              {description}
            </Typography>
            <Typography variant="body2">
              <strong>When:</strong>{" "}
              {start_time ? new Date(start_time).toLocaleString() : "—"}
            </Typography>
            <Typography variant="body2">
              <strong>Where:</strong> {location || "—"}
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Chip
              icon={<EventAvailableIcon />}
              label={`${available} / ${total_slots}`}
              color={available ? "primary" : "default"}
            />
            <Box sx={{ mt: 1 }}>
              <Button
                component={RouterLink}
                to={`/booking/${id}`}
                variant="contained"
                size="small"
              >
                Book Now
              </Button>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CampCard;
