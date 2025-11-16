import AuthorFeatures from "../components/AuthorFeatures";
import DashboardHighlights from "../components/DashboardHighlights";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import NavBar from "../components/NavBar";
import ReaderFeatures from "../components/ReaderFeatures";
import RegistrationSection from "../components/RegistrationSection";

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