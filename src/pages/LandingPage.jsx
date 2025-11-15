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
        {/* hello there */}
        </>
    );
}

export default LandingPage;