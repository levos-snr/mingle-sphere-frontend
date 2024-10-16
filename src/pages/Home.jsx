import React, { useState } from 'react';

export default function Home() {
  // State to track the selected event and show the payment modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Function to handle booking button clicks
  const handleBooking = (eventName) => {
    setSelectedEvent(eventName);
    setShowPaymentModal(true); 
  };

  // Function to handle payment method selection
  const handlePayment = (paymentMethod) => {
    alert(`You have chosen to pay with ${paymentMethod} for "${selectedEvent}"!`);
    setShowPaymentModal(false); 
  };

  return (
    <div className="home-container">
      {/* Welcome message and CTA */}
      <h1>Welcome to Event Booking System</h1>
      <p>Explore and reserve spots at exciting events near you!</p>

      {/* About the platform */}
      <div className="about-section">
        <h2>About Our Platform</h2>
        <p>
          Our event booking system allows you to easily browse and register for upcoming events. Whether it's a concert, conference, or a local community event, you can book your spot in just a few clicks.
          Stay updated with our latest event listings and never miss out on exciting happenings around you!
        </p>

        {/* Features */}
        <ul className="platform-features">
          <li>Easy event registration and booking</li>
          <li>Search for events by category, location, or date</li>
          <li>Manage your bookings and receive updates</li>
          <li>Special discounts for early registrations</li>
        </ul>
      </div>

      {/* Featured events preview */}
      <div className="upcoming-events">
        <h2>Featured Events</h2>
        <div className="event-grid">
          {/* Event cards fetched from API */}
          <div className="event-card">
            <h3>Music Concert: Summer Vibes</h3>
            <p>Date: July 25, 2024</p>
            <p>Location: Central Park, NYC</p>
            <button onClick={() => handleBooking('Music Concert: Summer Vibes')}>Book Now</button>
          </div>
          <div className="event-card">
            <h3>Tech Conference 2024</h3>
            <p>Date: August 12, 2024</p>
            <p>Location: Silicon Valley, CA</p>
            <button onClick={() => handleBooking('Tech Conference 2024')}>Book Now</button>
          </div>
          <div className="event-card">
            <h3>Art Exhibition: Modern Masterpieces</h3>
            <p>Date: September 5, 2024</p>
            <p>Location: Louvre Museum, Paris</p>
            <button onClick={() => handleBooking('Art Exhibition: Modern Masterpieces')}>Book Now</button>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {showPaymentModal && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h3>Choose Payment Method for {selectedEvent}</h3>
            <button onClick={() => handlePayment('Credit Card')}>Credit Card</button>
            <button onClick={() => handlePayment('PayPal')}>PayPal</button>
            <button onClick={() => handlePayment('Mobile Money')}>Mobile Money</button>
            <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Testimonials section */}
      <div className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-card">
          <p>"Booking events has never been easier! I can find local events and register within minutes. Highly recommended!"</p>
          <p>- Sarah J.</p>
        </div>
        <div className="testimonial-card">
          <p>"This platform helped me find amazing tech conferences I didn't even know about. Great experience overall!"</p>
          <p>- Michael K.</p>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 Event Booking System. All rights reserved.</p>
        <p>Contact us: support@eventbooking.com</p>
      </footer>
    </div>
  );
}
