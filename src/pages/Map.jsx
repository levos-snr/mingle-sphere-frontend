import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Clock } from "lucide-react";
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// Add mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const EventMap = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 2,
  });

  // Fetch events data and geocode locations on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        const eventsData = response.data;

        const geocodedEvents = await Promise.all(
          eventsData.map(async (event) => {
            // Geocode event location using OpenStreetMap Nominatim API
            if (event.location) {
              const geocodeResponse = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(event.location)}`
              );
              if (geocodeResponse.data.length > 0) {
                const location = geocodeResponse.data[0];
                event.latitude = parseFloat(location.lat);
                event.longitude = parseFloat(location.lon);
              }
            }
            return event;
          })
        );

        // Filter out events without valid coordinates
        const validEvents = geocodedEvents.filter(
          (event) => !isNaN(event.latitude) && !isNaN(event.longitude)
        );

        if (validEvents.length > 0) {
          // Set initial map center to the first event's location
          setViewState({
            longitude: validEvents[0].longitude,
            latitude: validEvents[0].latitude,
            zoom: 1,
          });
        }

        setEvents(validEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  
  console.log(events);

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Events List on the Left */}
      <div style={{ width: "30%", padding: "20px", overflowY: "auto", backgroundColor: "#f9f9f9" }}>
        <h2>Events</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {events.map((event) => (
            <li
              key={event.id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: selectedEvent && selectedEvent.id === event.id ? "#ddd" : "#fff",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              onClick={() => setSelectedEvent(event)}
            >
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><Clock size={16} /> {new Date(event.start_datetime).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Map on the Right */}
      <div style={{ width: "70%" }}>
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {events.map((event) => (
            <Marker
              key={event.id}
              longitude={event.longitude}
              latitude={event.latitude}
              onClick={() => setSelectedEvent(event)}
            >
              <MapPin size={24} />
            </Marker>
          ))}

          {selectedEvent && (
            <Popup
              longitude={selectedEvent.longitude}
              latitude={selectedEvent.latitude}
              onClose={() => setSelectedEvent(null)}
            >
              <div>
                <h3>{selectedEvent.title}</h3>
                <p>{selectedEvent.description}</p>
                <p><Clock size={16} /> {new Date(selectedEvent.start_datetime).toLocaleDateString()}</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
};

export default EventMap;
