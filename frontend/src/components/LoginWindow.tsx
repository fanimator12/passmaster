import { Box, Grid, Link, Typography } from "@mui/material";
import { ChangeEvent, FormEvent } from "react";
import CheckboxLabel from "./CheckboxLabel";
import ErrorField from "./ErrorField";
import LinkLabel from "./LinkLabel";
import LoginTitle from "./LoginTitle";
import SubmitButton from "./SubmitButton";
import lightStyle from "../styles/LightTextFieldStyle";
import TypeTextField from "./TypeTextField";

export interface LoginWindowProps {
  isSignUp: boolean;
  title: string;
  link: string;
  label: string;
  windowTitle: string;
  submitTitle: string;
  helpText?: string;
  username: string;
  pwd: string;
  matchPwd?: string;
  validUsername: boolean;
  validPwd: boolean;
  validMatch?: boolean;
  errUsernameMsg: string;
  errPwdMsg: string;
  checked: boolean;
  isDisabled?: boolean;
  handleChecked: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUsernameField: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePwdField: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMatchField?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const LoginWindow = ({
  isSignUp,
  title,
  link,
  label,
  windowTitle,
  submitTitle,
  helpText,
  username,
  pwd,
  matchPwd,
  validUsername,
  validPwd,
  validMatch,
  errUsernameMsg,
  errPwdMsg,
  checked,
  isDisabled,
  handleChecked,
  handleUsernameField,
  handlePwdField,
  handleMatchField,
  handleSubmit,
}: LoginWindowProps) => {
  return (
    <Box className="sign-window" component="div">
      <Grid
        className="sign-title"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <LoginTitle title={windowTitle} />
      </Grid>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid
          container
          flexDirection="column"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <TypeTextField
            required={true}
            style={lightStyle}
            value={username}
            label={"Username"}
            variant={"outlined"}
            type={"email"}
            // error={emailFocus && !validEmail ? true : false}
            errorMsg={validUsername ? <ErrorField msg={errUsernameMsg} /> : <></>}
            handleChange={handleUsernameField}
          />
          <TypeTextField
            required={true}
            value={pwd}
            style={lightStyle}
            label={"Password"}
            variant={"outlined"}
            type={"password"}
            autoComplete={"current-password"}
            // error={pwdFocus && !validPwd ? true : false}
            errorMsg={validPwd ? <ErrorField msg={errPwdMsg} /> : <></>}
            handleChange={handlePwdField}
          />
          {isSignUp ? (
            <>
              <TypeTextField
                required={true}
                value={matchPwd}
                style={lightStyle}
                label={"Repeat Password"}
                variant={"outlined"}
                type={"password"}
                // error={matchFocus && !validMatch ? true : false}
                errorMsg={validMatch ? <ErrorField msg={errPwdMsg} /> : <></>}
                handleChange={handleMatchField}
              />
            </>
          ) : (
            <></>
          )}
        </Grid>

        <Grid
          className="sign-grid"
          item
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <CheckboxLabel
            labelText={
              isSignUp ? (
                <LinkLabel
                  link={"terms-and-conditions"}
                  label={"I agree to "}
                  title={"Terms & Conditions"}
                  extraLink={"privacy-policy"}
                  extraLabel={" and"}
                  extraTitle={"Privacy Policy"}
                />
              ) : (
                // TODO implement Remember me feature
                <Typography color="#fff">Remember me</Typography>
              )
            }
            checked={checked}
            handleChange={handleChecked}
          />

          {/* TODO implement Forgot Password? feature */}
          <Link href="/">
            <Typography color="#fff">{helpText}</Typography>
          </Link>
        </Grid>

        <Grid
          className="sign-grid"
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LinkLabel label={label} link={link} title={title} />
        </Grid>

        <Grid
          className="sign-grid"
          item
          display="flex"
          justifyContent="right"
          alignItems="flex-end"
        >
          <SubmitButton
            title={submitTitle}
            isDisabled={isDisabled}
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginWindow;