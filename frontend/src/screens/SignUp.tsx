import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, FormEvent, useState, ChangeEvent } from "react";
import API_BASE from "../api/api_root";
import "../App.css";
import Background from "../assets/background.mp4";
import LoginBackground from "../components/LoginBackground";
import LoginWindow from "../components/LoginWindow";
import { USER_REGEX, PWD_REGEX } from "../regex/regex";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SignUpProps {
  //Props come here
}

const SignUp = ({ ...props }: SignUpProps) => {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [checked, setChecked] = useState(false);
  const [errEmailMsg, setErrEmailMsg] = useState("");
  const [errPwdMsg, setErrPwdMsg] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    setValidEmail(USER_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrEmailMsg("");
    setErrPwdMsg("");
  }, [email, pwd, matchPwd]);

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const v1 = USER_REGEX.test(email);
    const v2 = PWD_REGEX.test(pwd);

    if (!v1) {
      setErrEmailMsg("Invalid Entry for Email");
      return;
    }

    if (!v2) {
      setErrPwdMsg("Invalid Entry for Password");
      return;
    }

    try {
      const response = await axios.post(API_BASE + `/token`, {
        email,
        password: pwd,
      });
      setUser(response.data);
      setSuccess(true);

      setEmail("");
      setPwd("");
      setMatchPwd("");
    } catch (e) {
      setError("Error: " + e);
    }
  };

  useEffect(() => {
    document.title = "Sign Up | PassMaster";
  });

  return (
    <Grid container className="fullscreen-container">
      <LoginBackground background={Background} slogan={"Create your Account"} />
      <Grid
        item
        alignSelf="center"
        xs={12}
        sm={8}
        md={5}
        sx={{
          marginLeft: { xs: 0, sm: "-4em" },
        }}
      >
        <LoginWindow
          isSignUp={true}
          handleSubmit={handleSubmit}
          title={"Sign In"}
          link={"sign-in"}
          label={"Already have an account?"}
          windowTitle={"get started"}
          submitTitle={"Sign Up"}
          email={email}
          pwd={pwd}
          matchPwd={matchPwd}
          validEmail={validEmail}
          validPwd={validPwd}
          validMatch={validMatch}
          errEmailMsg={errEmailMsg}
          errPwdMsg={errPwdMsg}
          checked={checked}
          // isDisabled={!validEmail || !validPwd || !validMatch || !checked ? true : false}
          isDisabled={!email || !pwd || !matchPwd || !checked ? true : false}
          handleChecked={handleChecked}
          handleEmailField={(e) => setEmail(e.target.value)}
          handlePwdField={(e) => setPwd(e.target.value)}
          handleMatchField={(e) => setMatchPwd(e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

export default SignUp;
