import AuthorDashboard from "./pages/AuthorDashboard"
import AuthorHomePage from "./pages/AuthorHomePage"
import LandingPage from "./pages/LandingPage"


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublishingPage from "./pages/PublishingPage";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import NotFound from "./pages/NotFound";
import AuthorIndexPage from "./pages/AuthorIndexPage";
import ReaderPortal from "./pages/ReaderPortal";
import ReaderHome from "./pages/ReaderHome";
import Store from "./pages/Store";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


function App() {


  return (
    <>
      <Router>
        <Routes>

          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />


          {/* Author portal */}
          <Route
            path="/dashboard"
            element={
              <RoleProtectedRoute role="author">
                <AuthorDashboard />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<AuthorIndexPage />} />
            <Route path="home" element={<AuthorIndexPage />} />

            <Route path="publications" element={<PublishingPage />} />
          </Route>

          {/* Reader portal */}
          <Route
            path="/reader/dashboard"
            element={<RoleProtectedRoute role="reader"><ReaderPortal /></RoleProtectedRoute>}
          >
            <Route index element={<ReaderHome />} />
            <Route path="home" element={<ReaderHome />} />
            <Route path="store" element={<Store />} />

          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
