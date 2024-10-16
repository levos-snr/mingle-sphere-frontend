import React, { useState } from 'react';
import Home from './pages/Home';
import Footer from './components/Footer';
import Login from './pages/Login';
import Booking from './pages/Booking';
import Register from './pages/Register';
import './App.css'; 




function App() {
  const [activeForm, setActiveForm] = useState(null);

  const handleFormChange = (form) => {
    setActiveForm(form);
  };

  return (
    <div className="App">
      <nav>
        <button onClick={() => handleFormChange('login')}>Login</button>
        <button onClick={() => handleFormChange('register')}>Register</button>
        <button onClick={() => handleFormChange('booking')}>Booking</button>
      </nav>

    
      {activeForm === 'login' && <Login />}
      {activeForm === 'register' && <Register />}
      {activeForm === 'booking' && <Booking />}

      <Home />
      <Footer />
    </div>
  );
}

export default App;
