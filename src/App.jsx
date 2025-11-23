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


          {/* Author portal */}
          <Route
            path="/dashboard"
            element={
              <RoleProtectedRoute role="author">
                <AuthorDashboard />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<AuthorHomePage />} />
            <Route path="home" element={<AuthorHomePage />} />
            <Route path="publications" element={<PublishingPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
