import React, { useState } from 'react';

function Booking() {
  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Where we gonna Add booking logic here (e.g., send data to an API)
    console.log('Booking Details:', { event, date, name, email });
  };

  return (
    <div>
      <h2>Booking</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event">Event:</label>
          <input 
            type="text" 
            id="event" 
            value={event} 
            onChange={(e) => setEvent(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default Booking;
