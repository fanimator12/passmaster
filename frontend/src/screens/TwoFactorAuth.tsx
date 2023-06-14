import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTotp, loginUser, verifyTotp } from "../api/api_root";
import { QRCodeSVG } from "qrcode.react";

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
    <div>
      <h1>Download Authenticator app for Android or iOS</h1>
      {error && <p>{error}</p>}
      {qrCode && <QRCodeSVG value={qrCode} />}
      <form onSubmit={handleTotp}>
      <label>
          Username:
          <input
            type="text"
            value={username}
            required
          />
        </label>
        <br />
        <label>
          One-time 2FA Code:
          <input
            type="text"
            value={totpToken}
            onChange={(e) => setTotpToken(e.target.value)}
            required
          />
        </label>
        <br />
        <input type="submit" value="Verify" disabled={loading} />
      </form>
    </div>
  );
};

export default TwoFactorAuth;
