import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTotp, loginUser, verifyTotp } from "../api/api_root";
import { QRCodeSVG } from "qrcode.react";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useAuth } from "../contexts/AuthContext";
import field_style from "../styles/LightTextFieldStyle";

const TwoFactorAuth = () => {
  const [totpToken, setTotpToken] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, password } = location.state;
  const { logIn } = useAuth();
  const handleTotp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      await verifyTotp(username, totpToken);
      const tokenData = await loginUser(username, password);
      console.log(tokenData);
      logIn();
      navigate("/dashboard");
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

  useEffect(() => {
    const fetchQrCode = async () => {
      const totpData = await getTotp(username);
      setQrCode(totpData.qr_code);
    };

    fetchQrCode();
  }, [username]);

  return (
    <div className="fullscreen-container">
      <Container className="form-container" maxWidth="sm">
      <form className="form" onSubmit={handleTotp}>
        {error && <Alert severity="error">{error}</Alert>}
        {qrCode && <QRCodeSVG className="qrcode" color={"#fff"} value={qrCode} />}
        <Typography variant="h6" gutterBottom>
          Download Authenticator app for Android or iOS
        </Typography>
        <TextField
          label="Username"
          type="text"
          value={username}
          disabled
          required
          fullWidth
          margin="normal"
          sx={field_style}
        />
        <TextField
          label="One-time 2FA Code"
          type="text"
          value={totpToken}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTotpToken(e.target.value)
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
          Verify
        </Button>
        {loading && <CircularProgress />}
      </form>
    </Container>
    </div>
  );
};

export default TwoFactorAuth;
