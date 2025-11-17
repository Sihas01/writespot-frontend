
import FeatureCard from '../components/AuthorDashboard/FeatureCard';
import HeroSection from '../components/AuthorDashboard/HeroSection';
import LearnIllustration from '../assets/images/ad1.png';
import PublishIllustration from '../assets/images/ad2.png';
import SupportIllustration from '../assets/images/ad3.png';

const HomePage = () => {
    const features = [
        { title: 'Learn to Publish', illustration: LearnIllustration  },
        { title: 'Start Publishing', illustration: PublishIllustration },
        { title: 'Get Support', illustration: SupportIllustration }
    ];

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-nunito font-semibold text-[#5A7C65] mb-6">Welcome, John</h2>

            <div className='bg-white pb-6 rounded-lg'>
                <HeroSection />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        title={feature.title}
                        illustration={feature.illustration}
                    />
                ))}
            </div>
            </div>
        </div>
    );
};

export default HomePage;