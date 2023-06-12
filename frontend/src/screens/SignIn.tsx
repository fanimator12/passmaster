import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, FormEvent, ChangeEvent, useState } from "react";
import "../App.css";
import Background from "../assets/background.mp4";
import API_BASE from "../api/api_root";
import LoginBackground from "../components/LoginBackground";
import LoginWindow from "../components/LoginWindow";
import { USER_REGEX, PWD_REGEX } from "../regex/UserRegex";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SignInProps {
  //Props come here
}

const SignIn = ({ ...props }: SignInProps) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [errEmailMsg, setErrEmailMsg] = useState("");
  const [errPwdMsg, setErrPwdMsg] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidEmail(USER_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
  }, [pwd]);

  useEffect(() => {
    setErrEmailMsg("");
    setErrPwdMsg("");
  }, [email, pwd]);

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // TODO - Here comes the POST request to the API
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const response = await axios.post(API_BASE + `auth/users/`, {
        email,
        password: pwd,
      });
      setUser(response.data);
      setSuccess(true);

      setEmail("");
      setPwd("");
    } catch (e) {
      setError("Error: " + e);
    }
  };

  useEffect(() => {
    document.title = "Sign In | PassMaster";
  });

  return (
    <Grid container className="fullscreen-container-in">
      <Grid
        item
        display="flex"
        justifyContent="center"
        alignSelf="center"
        xs={12}
        sm={8}
        md={5}
      >
        <LoginWindow
          isSignUp={false}
          handleSubmit={handleSubmit}
          title={"Sign Up"}
          link={"sign-up"}
          label={"New here?"}
          windowTitle={"welcome back!"}
          submitTitle={"Sign In"}
          email={email}
          pwd={pwd}
          validEmail={validEmail}
          validPwd={validPwd}
          errEmailMsg={errEmailMsg}
          errPwdMsg={errPwdMsg}
          checked={checked}
          handleChecked={handleChecked}
          handleEmailField={(e) => setEmail(e.target.value)}
          handlePwdField={(e) => setPwd(e.target.value)}
        />
      </Grid>

      <LoginBackground
        background={Background}
        slogan={"Sign into your Account"}
      />
    </Grid>
  );
};

export default SignIn;
