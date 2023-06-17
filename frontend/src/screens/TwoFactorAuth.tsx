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
} from "@material-ui/core";
import Alert from "@mui/material/Alert";

const TwoFactorAuth = () => {
  const [totpToken, setTotpToken] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, password } = location.state;

  const handleTotp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("reached");

    try {
      setLoading(true);
      console.log("loading reached");
      await verifyTotp(username, totpToken);
      console.log("verify reached");

      const tokenData = await loginUser(username, password);
      console.log(tokenData);

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
    <Container
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleTotp}>
        {error && <Alert severity="error">{error}</Alert>}
        {qrCode && <QRCodeSVG value={qrCode} />}
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
        />
        <TextField
          label="One-time 2FA Code"
          type="text"
          value={totpToken}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotpToken(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button
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
  );
};

export default TwoFactorAuth;
