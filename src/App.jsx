import AuthorDashboard from "./pages/AuthorDashboard"
import AuthorHomePage from "./pages/AuthorHomePage"
import LandingPage from "./pages/LandingPage"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublishingPage from "./pages/PublishingPage";

function App() {
 

  return (
    <>
      <Router>
      <Routes>

        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />
        {/* Author Dashboard */}
        <Route path="/dashboard" element={<AuthorDashboard />}>
          <Route index element={<AuthorHomePage />} />
          <Route path="home" element={<AuthorHomePage />} />
          <Route path="publications" element={<PublishingPage />} />
          {/* <Route path="revenue" element={<RevenuePage />} /> */}
        </Route>

      </Routes>
    </Router>
    </>
  )
}

export default App
