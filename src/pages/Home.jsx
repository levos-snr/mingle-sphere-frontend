import React from "react";
import EventHeroBanner from "../components/EventHeroBanner";
import MainDisplay from "../components/MainDisplay";
import AdditionalDisplay from "../components/AdditionalDisplay";

const Home = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section with Slide-in Animation */}
      <div className="animate-fade-in">
        <EventHeroBanner />
      </div>

      {/* Main Display Section with Fade-in and Slide-up Animation */}
      <div className="mt-12 animate-slide-up">
        <MainDisplay />
      </div>

      {/* Additional Display Section with Delay in Animation for Staggering */}
      <div className="mt-12 animate-fade-in-up animation-delay-500">
        <AdditionalDisplay />
      </div>
    </div>
  );
};

export default Home;
