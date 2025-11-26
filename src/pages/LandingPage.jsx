import AuthorFeatures from "../components/landingPage/AuthorFeatures";
import DashboardHighlights from "../components/landingPage/DashboardHighlights";
import FAQSection from "../components/landingPage/FAQSection";
import Footer from "../components/landingPage/Footer";
import HeroSection from "../components/landingPage/HeroSection";
import NavBar from "../components/landingPage/NavBar";
import ReaderFeatures from "../components/landingPage/ReaderFeatures";
import RegistrationSection from "../components/landingPage/RegistrationSection";

const LandingPage = () => {
    return(
        <>
        <NavBar/>
        <HeroSection/>
        <AuthorFeatures/>
        <DashboardHighlights/>
        <ReaderFeatures/>
        <RegistrationSection/>
        <FAQSection/>
        <Footer/>
        </>
    );
}

export default LandingPage;