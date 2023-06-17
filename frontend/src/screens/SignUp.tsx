import { registerUser } from "../api/api_root";
import { useState } from "react";
import "../App.css";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Dialog,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import field_style from "../styles/LightTextFieldStyle";
import { SignUpProps } from "../props";
import SignIn from "./SignIn";
const SignUp = ({ handleClose }: SignUpProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openSignIn, setOpenSignIn] = useState(false);
  const navigate = useNavigate();

  const handleOpenSignIn = () => {
    setOpenSignIn(true);
  };

  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      const user = {
        username,
        email,
        fullname,
        password,
      };
      const response = await registerUser(user);
      console.log(response);
      navigate("/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Sign Up failed. Please contact for support.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fullscreen-container">
      <Container className="form-container" maxWidth="sm">
        <form className="form" onSubmit={handleSubmit}>
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
            Sign Up
          </Typography>
          {error && (
            <Alert className="alert" severity="error">
              {error}
            </Alert>
          )}
          <TextField
            className="input"
            label="Username"
            type="text"
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
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            fullWidth
            margin="normal"
            sx={field_style}
          />
          <TextField
            className="input"
            label="Full Name"
            type="text"
            value={fullname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFullname(e.target.value)
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
            Sign Up
          </Button>
          {loading && <CircularProgress className="progress" />}
          <Typography
            className="sign-link"
            variant="body1"
            style={{ marginTop: "1em" }}
          >
            Already have an account?{" "}
            <Button onClick={handleOpenSignIn} style={{ color: "#fff" }}>
              Sign In
            </Button >
          </Typography>
        </form>
      </Container>
      <Dialog
        open={openSignIn}
        onClose={handleCloseSignIn}
        aria-labelledby="sign-in-modal-title"
        aria-describedby="sign-in-modal-description"
      >
        <SignIn handleClose={handleCloseSignIn} />
      </Dialog>
    </div>
  );
};

export default SignUp;
