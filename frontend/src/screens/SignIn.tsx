import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import field_style from "../styles/LightTextFieldStyle";
import SignUp from "./SignUp";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const navigate = useNavigate();

  const handleOpenSignUp = () => {
    setOpenSignUp(true);
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);

      navigate("/auth", { state: { username, password } });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Sign In failed. Please contact for support.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fullscreen-container">
      <Container className="form-container" maxWidth="sm">
        <form className="form" onSubmit={handleLogin}>
          <Typography
            className="title"
            variant="h3"
            gutterBottom
            style={{
              marginTop: 0,
              paddingBottom: "5px",
              fontSize: "30px",
              fontFamily: "Oswald Regular",
              textTransform: "uppercase",
            }}
          >
            Sign In
          </Typography>
          {error && (
            <Alert className="alert" severity="error">
              {error}
            </Alert>
          )}
          <TextField
            className="input"
            label="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            required
            fullWidth
            margin="normal"
            sx={field_style}
          />
          <TextField
            className="input"
            label="Password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
            fullWidth
            margin="normal"
            sx={field_style}
          />
          <Button
            className="button"
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            Sign In
          </Button>
          {loading && <CircularProgress className="progress" />}
          <Typography
            className="sign-link"
            variant="body1"
            style={{ marginTop: "1em" }}
          >
            New here?{" "}
            <Button onClick={handleOpenSignUp} style={{ color: "#fff" }}>
              Sign Up
            </Button>
          </Typography>
        </form>
      </Container>
      <Dialog
        open={openSignUp}
        onClose={(_event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleCloseSignUp();
          }
        }}
        aria-labelledby="sign-up-modal-title"
        aria-describedby="sign-up-modal-description"
      >
        <SignUp />
      </Dialog>
    </div>
  );
};

export default SignIn;
