import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapPin, Clock } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const EventMap = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapboxgl.accessToken) {
        setError("Mapbox access token is missing. Please check your environment variables.");
        return;
      }

      if (!mapContainerRef.current) {
        setError("Map container not found. Please check the component rendering.");
        return;
      }

      try {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [0, 0],
          zoom: 2,
          pitch: 45,
          bearing: -17.6,
          antialias: true
        });

        mapRef.current.on('load', () => {
          // 3D buildings
          const layers = mapRef.current.getStyle().layers;
          const labelLayerId = layers.find(
            (layer) => layer.type === 'symbol' && layer.layout['text-field']
          ).id;

          mapRef.current.addLayer(
            {
              id: 'add-3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              filter: ['==', 'extrude', 'true'],
              type: 'fill-extrusion',
              minzoom: 15,
              paint: {
                'fill-extrusion-color': '#fb923c',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
              }
            },
            labelLayerId
          );
        });
      } catch (mapError) {
        setError(`Failed to initialize map: ${mapError.message}`);
      }
    };

    initializeMap();

    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events');
        const eventsData = response.data;

        const geocodedEvents = await Promise.all(
          eventsData.map(async (event) => {
            if (event.location) {
              try {
                const geocodeResponse = await axios.get(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(event.location)}`
                );
                if (geocodeResponse.data.length > 0) {
                  const location = geocodeResponse.data[0];
                  event.latitude = parseFloat(location.lat);
                  event.longitude = parseFloat(location.lon);
                }
              } catch (geocodeError) {
                console.error(`Error geocoding ${event.location}:`, geocodeError);
              }
            }
            return event;
          })
        );

        const validEvents = geocodedEvents.filter(
          (event) => !isNaN(event.latitude) && !isNaN(event.longitude)
        );

        setEvents(validEvents);
        setLoading(false);

        if (validEvents.length > 0 && mapRef.current) {
          mapRef.current.flyTo({
            center: [validEvents[0].longitude, validEvents[0].latitude],
            zoom: 13
          });

          validEvents.forEach((event) => {
            new mapboxgl.Marker({ color: '#f97316' })
              .setLngLat([event.longitude, event.latitude])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                  `<h3>${event.title}</h3><p>${event.description}</p><p>${new Date(event.start_datetime).toLocaleDateString()}</p>`
                )
              )
              .addTo(mapRef.current);
          });
        }
      } catch (error) {
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);

    // fly to event location on map (kama ndege)
    if (mapRef.current && event.latitude && event.longitude) {
      mapRef.current.flyTo({
        center: [event.longitude, event.latitude],
        zoom: 14
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="lg:w-1/3 p-4 overflow-y-auto bg-gray-900 lg:h-screen">
        <h2 className="text-xl font-bold text-orange-500 mb-4">Events</h2>
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p className="text-white">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-white">No events found or all events failed to geocode.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event.id}
                className={`p-4 rounded-lg ${selectedEvent && selectedEvent.id === event.id ? "bg-gray-600" : "bg-gray-800"} hover:bg-gray-700 cursor-pointer`}
                onClick={() => handleEventClick(event)}
              >
                <h3 className="text-lg font-semibold text-orange-500">{event.title}</h3>
                <p className="text-gray-300">{event.description}</p>
                <p className="flex items-center text-gray-400">
                  <Clock size={16} className="mr-1 text-orange-500" />
                  {new Date(event.start_datetime).toLocaleDateString()}
                </p>
                <p className="flex items-center text-gray-400">
                  <MapPin size={16} className="mr-1 text-orange-500" />
                  {event.location}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* mapppp */}
      <div className="lg:w-2/3 w-full" ref={mapContainerRef} style={{ height: "100%" }} />
    </div>
  );
};

export default EventMap;
