// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" }, // modern blue
    secondary: { main: "#00bfa5" },
    background: { default: "#f4f7fb", paper: "#ffffff" },
  },
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "-apple-system",
      "Segoe UI",
      "Helvetica Neue",
      "Arial",
    ].join(","),
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
});

export default theme;
