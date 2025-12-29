import AuthorDashboard from "./pages/AuthorDashboard"
import AuthorHomePage from "./pages/AuthorHomePage"
import LandingPage from "./pages/LandingPage"
import AuthorRevenue from "./pages/AuthorRevenue"


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
import BookDetail from "./pages/BookDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import PaymentFailed from "./pages/PaymentFailed";
import Library from "./pages/Library";
import EPubReader from "./pages/EPubReader";


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
            <Route path="revenue" element={<AuthorRevenue />} />
          </Route>

          {/* Reader portal */}
          <Route
            path="/reader/dashboard"
            element={<RoleProtectedRoute role="reader"><ReaderPortal /></RoleProtectedRoute>}
          >
            <Route index element={<ReaderHome />} />
            <Route path="home" element={<ReaderHome />} />
            <Route path="store" element={<Store />} />
            <Route path="store/:bookId" element={<BookDetail />} />
            <Route path="library" element={<Library />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="thank-you" element={<ThankYou />} />
            <Route path="payment-failed" element={<PaymentFailed />} />

          </Route>

          {/* Dedicated Reader Route */}
          <Route
            path="/reader/view/:bookId"
            element={<RoleProtectedRoute role="reader"><EPubReader /></RoleProtectedRoute>}
          />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
