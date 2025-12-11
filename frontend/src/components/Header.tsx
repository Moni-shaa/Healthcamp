// src/components/Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Link as RouterLink } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Toolbar sx={{ gap: 2 }}>
        <LocalHospitalIcon sx={{ mr: 1 }} />
        <Typography
          component={RouterLink}
          to="/"
          sx={{
            color: "white",
            textDecoration: "none",
            fontWeight: 700,
            flexGrow: 1,
          }}
          variant="h6"
        >
          HealthCamp
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button component={RouterLink} to="/" color="inherit">
            Camps
          </Button>
          <Button
            component={RouterLink}
            to="/admin"
            color="inherit"
            variant="outlined"
            sx={{ borderColor: "rgba(255,255,255,0.4)" }}
          >
            Admin
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
