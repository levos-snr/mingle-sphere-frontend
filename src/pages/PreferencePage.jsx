import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
} from "lucide-react";
import { Tooltip } from "flowbite-react";

const PreferencePage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [notificationsOn, setNotificationsOn] = useState(true);

  useEffect(() => {
    // Add animation to the Preferences text
    const preferencesText = document.getElementById("preferences-text");
    preferencesText.classList.add("animate-pulse");
  }, []);

  const togglePreference = (setter) => {
    setter((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center text-white">
      <h1
        id="preferences-text"
        className="text-6xl font-bold mb-8 text-center"
      >
        Preferences
      </h1>
      <p className="text-xl mb-8 text-center">
        Customize your experience here!
      </p>
      <div className="space-y-6">
        <PreferenceButton
          icon={darkMode ? Moon : Sun}
          text={darkMode ? "Dark Mode" : "Light Mode"}
          onClick={() => togglePreference(setDarkMode)}
        />
        <PreferenceButton
          icon={soundOn ? Volume2 : VolumeX}
          text={soundOn ? "Sound On" : "Sound Off"}
          onClick={() => togglePreference(setSoundOn)}
        />
        <PreferenceButton
          icon={notificationsOn ? Bell : BellOff}
          text={notificationsOn ? "Notifications On" : "Notifications Off"}
          onClick={() => togglePreference(setNotificationsOn)}
        />
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-12 bg-white text-purple-600 font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-110"
      >
        Back to Homepage
      </button>
    </div>
  );
};

const PreferenceButton = ({ icon: Icon, text, onClick }) => (
  <Tooltip content={text}>
    <button
      onClick={onClick}
      className="bg-white text-purple-600 p-3 rounded-full transition duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
    >
      <Icon size={24} />
    </button>
  </Tooltip>
);

export default PreferencePage;