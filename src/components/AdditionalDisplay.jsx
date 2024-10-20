import { Link } from 'react-router-dom';
import { Users } from 'lucide-react'; 
import { Button } from 'flowbite-react'; 
import graph from '../assets/graph.png';

const MakeEventSection = () => (
  <div className="bg-gray-800 text-white p-8 rounded-lg flex items-center justify-between space-x-6 animate-fade-in-up shadow-lg">
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-2 text-orange-400">Make Your Own Event</h2>
      <p className="text-gray-300">
        Organize your event today and let the world be part of your success.
      </p>
      <Link to="/addEvent">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <span className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Create Event
          </span>
        </Button>
      </Link>
    </div>
    <img 
      src={graph}
      alt="People planning event" 
      className="w-1/3 h-auto rounded-lg shadow-lg"
    />
  </div>
);

const BrandLogo = ({ name, color }) => (
  <div className={`w-24 h-12 flex items-center justify-center text-${color} font-bold`}>
    {name}
  </div>
);

const BrandsSection = () => (
  <div className="text-center my-12">
    <h2 className="text-2xl font-bold mb-2 text-gray-800">
      Join these <span className="text-orange-500">brands</span>
    </h2>
    <p className="text-gray-600 mb-8">
      We've had the pleasure of working with industry-defining brands. These are just some of them.
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
      <BrandLogo name="Spotify" color="green-500" />
      <BrandLogo name="Google" color="blue-500" />
      <BrandLogo name="Stripe" color="purple-500" />
      <BrandLogo name="YouTube" color="red-500" />
      <BrandLogo name="Microsoft" color="blue-500" />
      <BrandLogo name="Medium" color="gray-800" />
      <BrandLogo name="Zoom" color="blue-400" />
      <BrandLogo name="Uber" color="black" />
      <BrandLogo name="Grab" color="green-400" />
    </div>
  </div>
);

const AdditionalDisplay = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <MakeEventSection />
      <BrandsSection />
    </div>
  );
};

export default AdditionalDisplay;
