import { Instagram, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          {/* Logo Section */}
          <h2 className="text-2xl font-bold">
            mingle<span className="text-orange-400">sphere</span>
          </h2>

          <div className="flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-black px-4 py-2 rounded-l-md focus:outline-none"
            />
            <button className="bg-orange-500 px-4 py-2 rounded-r-md hover:bg-orange-600 transition-transform transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
        
        <nav className="mb-6">
          <ul className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm">
            <li><a href="#" className="hover:text-orange-400 transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">About</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Services</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Get in touch</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">FAQs</a></li>
          </ul>
        </nav>

        <hr className="border-gray-700 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">
              <Facebook size={20} />
            </a>
          </div>

          <p className="text-sm text-gray-400">
            © 2024 Minglesphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
