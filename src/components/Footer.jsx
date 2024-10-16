import React from 'react';


const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Event Booking System. All rights reserved.</p>
      <p>Follow us on social media:</p>
      <ul>
        <li><a href="https://www.facebook.com/eventbookingsystem">Facebook</a></li>
        <li><a href="https://www.twitter.com/eventbookingsystem">Twitter</a></li>
        <li><a href="https://www.instagram.com/eventbookingsystem">Instagram</a></li>
        <li><a href="https://www.linkedin.com/eventbookingsystem">LinkedIn</a></li>


      </ul>
    </footer>
  );
};


export default Footer;


