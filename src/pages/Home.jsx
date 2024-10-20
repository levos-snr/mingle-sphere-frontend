import EventHeroBanner from "../components/EventHeroBanner";
import MainDisplay from "../components/MainDisplay";
import AdditionalDisplay from "../components/AdditionalDisplay";

const Home = () => {
  return (
    <div className="bg-gray-100">
      <div className="animate-fade-in">
        <EventHeroBanner />
      </div>

      <div className="mt-[6rem] animate-slide-up">
        <MainDisplay />
      </div>

      <div className="mt-12 animate-fade-in-up animation-delay-500">
        <AdditionalDisplay />
      </div>
    </div>
  );
};

export default Home;
