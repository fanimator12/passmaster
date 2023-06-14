import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../screens/Home";
import TwoFactorAuth from "../screens/TwoFactorAuth";
const Dashboard = lazy(() => import("../screens/Dashboard"));
const SignUp = lazy(() => import("../screens/SignUp"));
const SignIn = lazy(() => import("../screens/SignIn"));

export const MainRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/auth" element={<TwoFactorAuth />} />

        <Route
          path="*"
          element={
            <main
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
                color: "#fff",
              }}
            >
              Oops! <br></br> There's nothing here.
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export const DashboardRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="*"
          element={
            <main
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
                color: "#fff",
              }}
            >
              Oops! <br></br> There's nothing here.
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

