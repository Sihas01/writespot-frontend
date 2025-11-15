import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import NavBar from "../components/NavBar";
import ReaderFeatures from "../components/ReaderFeatures";
import RegistrationSection from "../components/RegistrationSection";
import SectionOne from "../components/SectionOne";

const LandingPage = () => {
    return(
        <>
        <NavBar/>
        <HeroSection/>
        <ReaderFeatures/>
        <RegistrationSection/>
        <FAQSection/>
        <Footer/>
        </>
    );
}

export default LandingPage;