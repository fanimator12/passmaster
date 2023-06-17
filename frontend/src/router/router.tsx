import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../screens/Home";
import TwoFactorAuth from "../screens/TwoFactorAuth";
import Dashboard from "../screens/Dashboard";
import SignUp from "../screens/SignUp";
import SignIn from "../screens/SignIn";
import { useAuth } from "../contexts/AuthContext";

export const MainRouter = () => {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/auth" element={<TwoFactorAuth />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/sign-in" replace />
          }
        />
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
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/sign-in" replace />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/sign-in" replace />
          }
        />
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
